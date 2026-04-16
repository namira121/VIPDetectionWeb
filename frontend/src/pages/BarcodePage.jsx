import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import QRCode from "qrcode";
import axios from "axios";

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
          type: "namira_vip_login",
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

  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  const formatTime = (t) => t ? t.slice(0, 5) : "-";

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", borderBottom: "0.5px solid rgba(198,167,94,0.2)", background: "rgba(15,28,46,0.97)", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Detection</span>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/customer" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dashboard</Link>
          <Link to="/my-orders" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>My History</Link>
        </div>
      </nav>

      <div style={{ padding: "2.5rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>

          {/* PANAH BALIK + HEADER */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              to="/my-orders"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(232,223,210,0.5)", textDecoration: "none", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#C6A75E"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,223,210,0.5)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
              Kembali ke Riwayat Order
            </Link>
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>QR Code</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 0.3rem" }}>QR Code Event</h1>
            <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>Scan QR code ini saat acara akan berlangsung</p>
          </div>

          {/* CARD */}
          <div style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.18)", borderRadius: "16px", padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

            {error && (
              <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center", margin: "0 0 1rem" }}>{error}</p>
            )}

            {qrUrl && (
              <>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", display: "inline-block", border: "0.5px solid rgba(198,167,94,0.2)" }}>
                    <img src={qrUrl} alt="QR Code" width={220} height={220} />
                  </div>
                </div>

                {order && (
                  <div style={{ background: "rgba(15,28,46,0.6)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.2rem" }}>
                    {[
                      ["Nama Acara", order.event_name],
                      ["Tanggal", formatDate(order.event_date)],
                      ["Waktu", `${formatTime(order.event_start_time)} s/d ${formatTime(order.event_end_time)}`],
                    ].map(([label, val]) => (
                      <div key={label} style={{ marginBottom: "10px" }}>
                        <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500", margin: "0 0 3px" }}>{label}</p>
                        <p style={{ fontSize: "14px", color: "#F5F2EC", fontWeight: "500", margin: 0, fontFamily: "Georgia, serif" }}>{val}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handlePrint}
                  style={{ width: "100%", background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "13px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", marginBottom: "1.2rem" }}
                >
                  Cetak QR Code
                </button>
              </>
            )}

            <div style={{ height: "0.5px", background: "rgba(198,167,94,0.2)", margin: "0 0 1.2rem" }} />

            <div style={{ marginBottom: "1.2rem" }}>
              <span style={{ display: "inline-block", background: "rgba(198,167,94,0.1)", color: "#C6A75E", fontSize: "10px", fontWeight: "600", padding: "3px 12px", borderRadius: "20px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", border: "0.5px solid rgba(198,167,94,0.3)" }}>
                Aplikasi Mobile
              </span>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 6px" }}>Download aplikasi petugas</p>
              <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: "0 0 1rem", fontWeight: "300", lineHeight: "1.6" }}>
                Aplikasi ini digunakan oleh petugas lapangan untuk memindai QR code dan mengaktifkan sistem deteksi tamu VIP.
              </p>
            </div>

            <a
              href="/vip-detection.apk"
              download="VIP-Detection.apk"
              style={{ display: "block", width: "100%", padding: "13px", background: "rgba(198,167,94,0.1)", color: "#C6A75E", border: "0.5px solid rgba(198,167,94,0.4)", borderRadius: "8px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}
            >
              Download APK Android
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}