from flask import Flask, request, jsonify, send_from_directory
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

APP_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(APP_DIR, '..'))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id SERIAL PRIMARY KEY,
            user_id TEXT UNIQUE,
            name TEXT,
            hours TEXT,
            score INTEGER,
            accuracy INTEGER,
            time INTEGER,
            avg_time NUMERIC,
            timestamp TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

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

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM results WHERE user_id = %s", (user_id,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"status": "already_submitted"}), 403

    time_val = int(data.get("time") or 0)
    avg_time = round(time_val / 50, 2)

    cur.execute("""
        INSERT INTO results (user_id, name, hours, score, accuracy, time, avg_time, timestamp)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user_id,
        data.get("name"),
        data.get("hours"),
        int(data.get("score") or 0),
        int(data.get("accuracy") or 0),
        time_val,
        avg_time,
        datetime.now()
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "success"})

@app.route('/count')
def count():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM results;")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return {"count": count}

@app.route('/admin')
def admin():
    SECRET = "skibidiSSlicers2027bAd_AI_oOOocArs"
    key = request.args.get("key")
    if key != SECRET:
        return "Access denied", 403

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM results ORDER BY timestamp DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    html = "<h1>Data</h1><table border='1'>"
    if rows:
        headers = list(rows[0].keys())
        html += "<tr>" + "".join(f"<th>{h}</th>" for h in headers) + "</tr>"
        for row in rows:
            html += "<tr>" + "".join(f"<td>{row[h]}</td>" for h in headers) + "</tr>"
    html += "</table>"
    return html

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)