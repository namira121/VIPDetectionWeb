import cv2
import face_recognition
import requests
import time

AI_SERVER_URL = "http://127.0.0.1:5000/check-vip"

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("Kamera gagal dibuka")
    exit()

print("VIP SYSTEM - RUNNING")
print("Tekan Q untuk keluar")

active_labels = []
last_update_time = 0
display_duration = 3
cooldown = 3
last_sent_time = 0

while True:
    ret, frame = camera.read()
    if not ret:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame, model="hog")

    current_time = time.time()

    # =============================
    # KIRIM KE AI SERVICE
    # =============================
    if len(face_locations) > 0 and (current_time - last_sent_time > cooldown):

        print(f"{len(face_locations)} wajah terdeteksi → kirim ke AI")

        _, img_encoded = cv2.imencode(".jpg", frame)

        try:
            response = requests.post(
                AI_SERVER_URL,
                files={"image": img_encoded.tobytes()},
                timeout=5  # biar gak hang
            )

            if response.status_code == 200:
                data = response.json()

                if "results" in data:
                    active_labels = data["results"]
                    last_update_time = current_time

            last_sent_time = current_time

        except requests.exceptions.RequestException as e:
            print("AI Server Error:", e)

    # =============================
    # CLEAR LABEL
    # =============================
    if current_time - last_update_time > display_duration:
        active_labels = []

    # =============================
    # DRAW BOX
    # =============================
    for i, (top, right, bottom, left) in enumerate(face_locations):

        color = (0, 255, 0)
        text = ""

        if i < len(active_labels):

            if active_labels[i]["status"] == "vip":
                text = f"{active_labels[i]['name']} ({active_labels[i]['confidence']}%)"
                color = (0, 255, 0)
            else:
                text = f"NON VIP ({active_labels[i]['confidence']}%)"
                color = (0, 0, 255)

        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

        if text != "":
            cv2.putText(
                frame,
                text,
                (left, top - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2
            )

    cv2.imshow("VIP Recognition System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

camera.release()
cv2.destroyAllWindows()
