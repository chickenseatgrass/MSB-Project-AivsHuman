from flask import Flask, request, jsonify
import csv
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return open("index.html").read()

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
    app.run(debug=True)
