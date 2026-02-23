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
    "password": "",
    "database": "vip_detection"
}

# Folder tempat foto disimpan
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
IMAGE_FOLDER = os.path.join(PROJECT_ROOT, "backend", "uploads")  

# ==========================
# GLOBAL STORAGE
# ==========================
vip_encodings = []
vip_names = []
vip_ids = []


# ==========================
# LOAD VIP FROM DATABASE
# ==========================
def load_vip_from_db():
    global vip_encodings, vip_names, vip_ids

    vip_encodings = []
    vip_names = []
    vip_ids = []

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, name, photo_path FROM vip_guests")
        rows = cursor.fetchall()

        print("\n=== LOAD VIP FROM DB ===")
        print("Total rows from DB:", len(rows))

        for row in rows:
            photo_path = row["photo_path"]
            photo_path = photo_path.replace("\\", "/")

            full_path = os.path.join(PROJECT_ROOT, "backend", photo_path)

            print("Cek file:", full_path)

            if not os.path.exists(full_path):
                print("❌ File tidak ditemukan:", full_path)
                continue

            image = face_recognition.load_image_file(full_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) == 0:
                print("❌ Tidak ada wajah di foto:", photo_path)
                continue

            vip_encodings.append(encodings[0])
            vip_names.append(row["name"])
            vip_ids.append(row["id"])

            print("✅ Loaded:", row["name"])

        cursor.close()
        conn.close()

        print("TOTAL VIP LOADED:", len(vip_encodings))
        print("=========================\n")

    except Exception as e:
        print("ERROR LOAD VIP:", e)


# Load saat server start
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

    results = []
    threshold = 0.45  # bisa kamu adjust

    for face_encoding in encodings:

        # Kalau belum ada VIP sama sekali
        if len(vip_encodings) == 0:
            results.append({
                "status": "non-vip",
                "confidence": 0
            })
            continue

        distances = face_recognition.face_distance(vip_encodings, face_encoding)

        best_match_index = np.argmin(distances)
        best_distance = distances[best_match_index]

        # Confidence formula lebih realistis
        confidence = (1 - best_distance) * 100
        confidence = max(0, min(confidence, 100))

        print("Best distance:", best_distance)
        print("Confidence:", confidence)

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
    # KIRIM KE NODE BACKEND
    # ==========================
    try:
        requests.post(NODE_BACKEND_URL, json={"results": results})
    except Exception as e:
        print("Gagal kirim ke backend:", e)

    return jsonify({
        "faces_detected": len(results),
        "results": results
    })


# ==========================
# RELOAD VIP ENDPOINT
# ==========================
@app.route("/reload-vip", methods=["POST"])
def reload_vip():
    load_vip_from_db()
    return jsonify({"message": "VIP reloaded"})


# ==========================
# RUN SERVER
# ==========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)