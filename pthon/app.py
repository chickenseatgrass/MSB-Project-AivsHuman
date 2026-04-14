from flask import Flask, request, jsonify, send_from_directory, send_file
import csv
from datetime import datetime
import os

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(APP_DIR, '..'))
DATA_FILE = os.path.join(BASE_DIR, "data.csv")

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

def init_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["user_id", "name", "hours", "score", "accuracy", "time", "avg_time", "timestamp"])

init_data_file()

def has_taken_test(user_id):
    if not os.path.exists(DATA_FILE):
        return False
    with open(DATA_FILE, 'r', newline='') as file:
        reader = csv.reader(file)
        next(reader, None)
        for row in reader:
            if row and row[0] == user_id:
                return True
    return False

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/instruct.html')
def instruct():
    return app.send_static_file('instruct.html')

@app.route('/test.html')
def test():
    return app.send_static_file('test.html')

@app.route('/results.html')
def results():
    return app.send_static_file('results.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    user_id = data.get("user_id")

    with open(DATA_FILE, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            user_id,
            data.get("name"),
            data.get("hours"),
            data.get("score"),
            data.get("accuracy"),
            data.get("time"),
            round((data.get("time") or 0) / 50, 2),
            datetime.now().isoformat()
        ])

    return jsonify({"status": "success"})

@app.route('/download')
def download():
    SECRET = "skibidiSSlicers2027bAd_AI_oOOocArs"
    key = request.args.get("key")
    if key != SECRET:
        return "Access denied", 403
    return send_file(DATA_FILE, as_attachment=True)

@app.route('/admin')
def admin():
    SECRET = "skibidiSSlicers2027bAd_AI_oOOocArs"
    key = request.args.get("key")
    if key != SECRET:
        return "Access denied", 403

    rows = []
    with open(DATA_FILE, 'r', newline='') as file:
        reader = csv.reader(file)
        headers = next(reader, None)
        for row in reader:
            if row:
                rows.append(row)

    html = "<h1>Admin Data</h1><table border='1'>"
    if headers:
        html += "<tr>" + "".join(f"<th>{h}</th>" for h in headers) + "</tr>"
    for row in rows:
        html += "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"
    html += "</table>"
    return html

@app.route("/count")
def count():
    if not os.path.exists(DATA_FILE):
        return {"count": 0}
    with open(DATA_FILE, newline='') as f:
        return {"count": max(0, sum(1 for _ in f) - 1)}

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
