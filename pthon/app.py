from flask import Flask, request, jsonify, send_from_directory
import csv
from datetime import datetime
import os

app = Flask(__name__, static_folder='.', static_url_path='')

DATA_FILE = "data.csv"

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["user_id", "name", "age", "score", "accuracy", "time", "timestamp"])

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

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json

    user_id = data.get("user_id")

    if has_taken_test(user_id):
        return jsonify({"status": "error", "message": "u cant take the test twice broski"}), 403

    with open(DATA_FILE, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            user_id,
            data.get("name"),
            data.get("age"),
            data.get("score"),
            data.get("accuracy"),
            data.get("time"),
            round(data.get("time") / 50, 2),  # avg time
            datetime.now()
        ])

    return jsonify({"status": "success"})

from flask import send_file

@app.route('/download')
def download():
    SECRET = "skibidiSSlicers2027bAd_AI_oOOocArs"

    key = request.args.get("key")
    if key != SECRET:
        return "uh u cant be here shh", 403

    return send_file(DATA_FILE, as_attachment=True)

@app.route('/admin')
def admin():
    SECRET = "skibidiSSlicers2027bAd_AI_oOOocArs" 

    key = request.args.get("key")
    if key != SECRET:
        return "uh u cant be here shh", 403

    rows = []
    with open(DATA_FILE, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            rows.append(row)

    html = "<h1>Data</h1><table border='1'>"
    
    for row in rows:
        html += "<tr>"
        for cell in row:
            html += f"<td>{cell}</td>"
        html += "</tr>"

    html += "</table>"
    return html

def has_taken_test(user_id):
    if not os.path.exists(DATA_FILE):
        return False

    with open(DATA_FILE, 'r') as file:
        reader = csv.reader(file)
        next(reader) 
        for row in reader:
            if row[0] == user_id:
                return True
    return False


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)