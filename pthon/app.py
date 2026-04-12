from flask import Flask, request, jsonify, send_from_directory, send_file
import csv
from datetime import datetime
import os

APP_DIR = os.path.dirname(os.path.abspath(__file__))        # Folder containing app.py
BASE_DIR = os.path.abspath(os.path.join(APP_DIR, '..'))     # Parent folder where HTML/JS/CSS live

DATA_FILE = os.path.join(BASE_DIR, "data.csv")

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["user_id", "name", "age", "score", "accuracy", "time", "avg_time", "timestamp"])

def has_taken_test(user_id):
    if not os.path.exists(DATA_FILE):
        return False
    with open(DATA_FILE, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # skip header
        for row in reader:
            if row[0] == user_id:
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

    if has_taken_test(user_id):
        return jsonify({"status": "error", "message": "you cant take the test twice broski"}), 403

    with open(DATA_FILE, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            user_id,
            data.get("name"),
            data.get("age"),
            data.get("score"),
            data.get("accuracy"),
            data.get("time"),
            round(data.get("time") / 50, 2),  # avg time per question
            datetime.now()
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
    with open(DATA_FILE, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append(row)

    html = "<h1>Data</h1><table border='1'>"
    for row in rows:
        html += "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"
    html += "</table>"
    return html

@app.route("/count")
def count():
    with open("data.csv") as f:
        return {"count": sum(1 for _ in f) - 1}

@app.route("/delete/<user_id>", methods=["GET"])
def delete(user_id):
    import csv

    rows = []
    with open("data.csv", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            if row["user_id"] != user_id:
                rows.append(row)

    with open("data.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return {"status": "deleted", "user_id": user_id}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)