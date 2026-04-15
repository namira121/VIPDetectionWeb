import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0F1C2E",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#F5F2EC",
    borderRadius: "16px",
    padding: "40px",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0F1C2E",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#2E4057",
    marginBottom: "28px",
  },
  qrBox: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    display: "inline-block",
    marginBottom: "16px",
    border: "2px solid #E8DFD2",
  },
  eventInfo: {
    backgroundColor: "#E8DFD2",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "28px",
    textAlign: "left",
  },
  eventLabel: {
    fontSize: "11px",
    color: "#2E4057",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "2px",
  },
  eventValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F1C2E",
    marginBottom: "8px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #C6A75E",
    margin: "24px 0",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0F1C2E",
    marginBottom: "6px",
  },
  sectionDesc: {
    fontSize: "13px",
    color: "#2E4057",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  btnPrimary: {
    display: "block",
    width: "100%",
    padding: "14px",
    backgroundColor: "#C6A75E",
    color: "#0F1C2E",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "10px",
    textDecoration: "none",
    boxSizing: "border-box",
  },
  btnSecondary: {
    display: "block",
    width: "100%",
    padding: "13px",
    backgroundColor: "transparent",
    color: "#2E4057",
    border: "2px solid #2E4057",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#0F1C2E",
    color: "#C6A75E",
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 10px",
    borderRadius: "20px",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  },
  errorText: {
    color: "#c0392b",
    fontSize: "14px",
    marginTop: "16px",
  },
};

export default function BarcodePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setOrder(data);

        if (data.status !== "paid") {
          setError("QR code hanya tersedia untuk order yang sudah dibayar.");
          return;
        }

        const payload = JSON.stringify({
          order_id: data.id,
          event_name: data.event_name,
          event_date: data.event_date,
        });

        const url = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 2,
          color: { dark: "#0F1C2E", light: "#ffffff" },
        });
        setQrUrl(url);
      } catch (err) {
        setError("Gagal memuat data order.");
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => window.print();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.title}>QR Code Event</p>
        <p style={styles.subtitle}>
          Scan QR code ini saat acara akan berlangsung
        </p>

        {error && <p style={styles.errorText}>{error}</p>}

        {qrUrl && (
          <>
            <div style={styles.qrBox}>
              <img src={qrUrl} alt="QR Code" width={220} height={220} />
            </div>

            {order && (
              <div style={styles.eventInfo}>
                <p style={styles.eventLabel}>Nama acara</p>
                <p style={styles.eventValue}>{order.event_name}</p>
                <p style={styles.eventLabel}>Tanggal</p>
                <p style={styles.eventValue}>{order.event_date}</p>
                <p style={styles.eventLabel}>Waktu</p>
                <p style={{ ...styles.eventValue, marginBottom: 0 }}>
                  {order.event_start_time} s/d {order.event_end_time}
                </p>
              </div>
            )}

            <button onClick={handlePrint} style={styles.btnPrimary}>
              Cetak QR Code
            </button>
          </>
        )}

        <hr style={styles.divider} />

        <span style={styles.badge}>Aplikasi Mobile</span>
        <p style={styles.sectionTitle}>Download aplikasi petugas</p>
        <p style={styles.sectionDesc}>
          Aplikasi ini digunakan oleh petugas lapangan untuk memindai QR code
          dan mengaktifkan sistem deteksi tamu VIP.
        </p>

        
        <a
          href="/vip-detection.apk"
          download="VIP-Detection.apk"
          style={styles.btnPrimary}
        >
          Download APK 
        </a>

        <button
          onClick={() => navigate("/my-orders")}
          style={styles.btnSecondary}
        >
          Kembali ke My Orders
        </button>
      </div>
    </div>
  );
}