import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"

function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:3000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrder(res.data)
      } catch (err) {
        alert("Order tidak ditemukan")
        navigate("/my-orders")
      }
    }
    fetchOrder()
  }, [orderId])

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return alert("Upload bukti transfer terlebih dahulu")
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("order_id", orderId)
      formData.append("proof", file)
      await axios.post("http://localhost:3000/payments", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      alert("Pembayaran berhasil dikirim!")
      navigate("/my-orders")
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim pembayaran")
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#C6A75E",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block",
  }

  if (!order) return <div style={{ background: "#0F1C2E", minHeight: "100vh" }} />

  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  })

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
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Pembayaran</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 0.3rem" }}>Konfirmasi Pembayaran</h1>
            <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>Upload bukti transfer untuk menyelesaikan order</p>
          </div>

          {/* CARD */}
          <div style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.18)", borderRadius: "16px", padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

            {/* Info Order */}
            <div style={{ background: "rgba(15,28,46,0.6)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.2rem" }}>
              {[
                ["Event", order.event_name],
                ["Paket", order.Package?.name],
                ["Tanggal", formatDate(order.event_date)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "rgba(232,223,210,0.45)", fontWeight: "300" }}>{label}</span>
                  <span style={{ color: "#E8DFD2", fontWeight: "500" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderTop: "0.5px solid rgba(198,167,94,0.15)", paddingTop: "10px", marginTop: "6px" }}>
                <span style={{ color: "rgba(232,223,210,0.45)", fontWeight: "300" }}>Total Pembayaran</span>
                <span style={{ color: "#C6A75E", fontWeight: "600", fontSize: "15px", fontFamily: "Georgia, serif" }}>
                  Rp {Number(order.total_amount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Info Rekening */}
            <div style={{ background: "rgba(15,28,46,0.6)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.2rem", borderLeft: "2px solid #C6A75E" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500", margin: "0 0 10px" }}>Transfer ke rekening</p>
              <p style={{ color: "#E8DFD2", fontSize: "14px", fontWeight: "500", margin: "0 0 4px" }}>Bank BCA</p>
              <p style={{ color: "#C6A75E", fontSize: "20px", fontWeight: "500", margin: "0 0 4px", letterSpacing: "2px", fontFamily: "Georgia, serif" }}>1234 5678 90</p>
              <p style={{ color: "rgba(232,223,210,0.4)", fontSize: "12px", margin: 0, fontWeight: "300" }}>a/n VIP Detection</p>
            </div>

            {/* Upload Bukti */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Bukti Transfer</label>

              {preview ? (
                <div>
                  <img src={preview} alt="preview" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px", maxHeight: "200px", objectFit: "cover" }} />
                  <label htmlFor="proof-input" style={{ display: "block", textAlign: "center", color: "#C6A75E", fontSize: "12px", cursor: "pointer", letterSpacing: "0.06em" }}>
                    Ganti foto
                  </label>
                </div>
              ) : (
                <label htmlFor="proof-input" style={{ display: "block", border: "1px dashed rgba(198,167,94,0.3)", borderRadius: "10px", padding: "28px 24px", textAlign: "center", cursor: "pointer", background: "rgba(198,167,94,0.03)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(198,167,94,0.5)" strokeWidth="1.5" style={{ marginBottom: "10px" }}>
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                  <p style={{ color: "rgba(232,223,210,0.55)", fontSize: "13px", margin: "0 0 4px" }}>Klik untuk upload foto bukti transfer</p>
                  <p style={{ color: "rgba(232,223,210,0.3)", fontSize: "11px", margin: 0 }}>JPG, PNG — maks. 2MB</p>
                </label>
              )}

              <input id="proof-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            {/* Tombol Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{
                width: "100%", background: loading || !file ? "rgba(198,167,94,0.4)" : "#C6A75E",
                color: "#0F1C2E", border: "none", borderRadius: "8px",
                padding: "13px", fontSize: "12px", fontWeight: "600",
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: loading || !file ? "not-allowed" : "pointer",
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              {loading ? "Mengirim..." : "Kirim Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage