from flask import Flask, request, jsonify, send_from_directory 
import csv
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return open("index.html").read()

# ADD THIS: This handles the page your button is looking for
@app.route('/instruct.html')
def instruct():
    return open("instruct.html").read()

# OPTIONAL: This handles your CSS and JS files automatically
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    with open('data.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            data['name'],
            data['age'],
            data['score'],
            data['accuracy'],
            data['time'],
            datetime.now()
        ])
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
