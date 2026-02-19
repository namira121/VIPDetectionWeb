from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import mysql.connector
import requests
import os

app = Flask(__name__)

# ==========================
# CONFIG
# ==========================
NODE_BACKEND_URL = "http://localhost:3000/api/detections"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",  # sesuaikan
    "database": "vip_detection"  # sesuaikan
}

# ==========================
# LOAD VIP FROM DATABASE
# ==========================
vip_encodings = []
vip_names = []
vip_ids = []

def load_vip_from_db():
    global vip_encodings, vip_names, vip_ids

    vip_encodings = []
    vip_names = []
    vip_ids = []

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, photo_path FROM vip_guests")
    rows = cursor.fetchall()

    for row in rows:
        photo_path = row["photo_path"]

        if not os.path.exists(photo_path):
            continue

        image = face_recognition.load_image_file(photo_path)
        encodings = face_recognition.face_encodings(image)

        if len(encodings) > 0:
            vip_encodings.append(encodings[0])
            vip_names.append(row["name"])
            vip_ids.append(row["id"])

    cursor.close()
    conn.close()

    print("VIP loaded from DB:", len(vip_encodings))

# Load once when server starts
load_vip_from_db()


# ==========================
# DETECTION ENDPOINT
# ==========================
@app.route("/check-vip", methods=["POST"])
def check_vip():

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image = face_recognition.load_image_file(file)

    face_locations = face_recognition.face_locations(image, model="hog")
    encodings = face_recognition.face_encodings(image, face_locations)

    if len(encodings) == 0:
        return jsonify({"status": "no-face"})

    threshold = 0.42
    results = []

    for face_encoding in encodings:

        if len(vip_encodings) == 0:
            results.append({
                "status": "non-vip",
                "confidence": 0
            })
            continue

        distances = face_recognition.face_distance(vip_encodings, face_encoding)
        best_match_index = np.argmin(distances)
        best_distance = distances[best_match_index]

        confidence = max(0, (1 - best_distance) * 100)

        if best_distance < threshold:
            result = {
                "status": "vip",
                "vip_id": vip_ids[best_match_index],
                "name": vip_names[best_match_index],
                "confidence": round(confidence, 2)
            }
        else:
            result = {
                "status": "non-vip",
                "confidence": round(confidence, 2)
            }

        results.append(result)

    # ==========================
    # KIRIM KE BACKEND NODE
    # ==========================
    try:
        requests.post(NODE_BACKEND_URL, json={
            "results": results
        })
    except Exception as e:
        print("Gagal kirim ke backend:", e)

    return jsonify({
        "faces_detected": len(results),
        "results": results
    })


# ==========================
# OPTIONAL: RELOAD VIP
# ==========================
@app.route("/reload-vip", methods=["POST"])
def reload_vip():
    load_vip_from_db()
    return jsonify({"message": "VIP reloaded"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
