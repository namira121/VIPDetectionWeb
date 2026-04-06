import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  // Ambil detail order
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
      formData.append("proof", file)  // nama field harus "proof" sesuai multer

      await axios.post("http://localhost:3000/payments", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })

      alert("Pembayaran berhasil dikirim!")
      navigate("/my-orders")

    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim pembayaran")
    } finally {
      setLoading(false)
    }
  }

  if (!order) return <div style={{ background: "#0F1C2E", minHeight: "100vh" }} />

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", padding: "40px", display: "flex", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1a2d42", border: "0.5px solid #2E4057", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px", height: "fit-content" }}>

        <h2 style={{ color: "#E8DFD2", fontSize: "20px", fontWeight: 500, margin: "0 0 8px" }}>Konfirmasi Pembayaran</h2>
        <p style={{ color: "#9baab8", fontSize: "13px", margin: "0 0 24px" }}>Upload bukti transfer untuk menyelesaikan order</p>

        {/* Info Order */}
        <div style={{ background: "#0F1C2E", borderRadius: "10px", padding: "16px", marginBottom: "24px" }}>
          {[
            ["Event", order.event_name],
            ["Paket", order.Package?.name],
            ["Tanggal", order.event_date],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
              <span style={{ color: "#9baab8" }}>{label}</span>
              <span style={{ color: "#E8DFD2", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderTop: "0.5px solid #2E4057", paddingTop: "8px", marginTop: "4px" }}>
            <span style={{ color: "#9baab8" }}>Total Pembayaran</span>
            <span style={{ color: "#C6A75E", fontWeight: 500, fontSize: "15px" }}>
              Rp {Number(order.total_amount).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Info Rekening */}
        <div style={{ background: "#0F1C2E", borderRadius: "10px", padding: "16px", marginBottom: "24px", borderLeft: "3px solid #C6A75E" }}>
          <p style={{ color: "#C6A75E", fontSize: "12px", fontWeight: 500, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Transfer ke rekening</p>
          <p style={{ color: "#E8DFD2", fontSize: "14px", fontWeight: 500, margin: "0 0 4px" }}>Bank BCA</p>
          <p style={{ color: "#C6A75E", fontSize: "18px", fontWeight: 500, margin: "0 0 4px", letterSpacing: "1px" }}>1234 5678 90</p>
          <p style={{ color: "#9baab8", fontSize: "12px", margin: 0 }}>a/n VIP Detection</p>
        </div>

        {/* Upload */}
        <label style={{ color: "#E8DFD2", fontSize: "13px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
          Bukti Transfer
        </label>

        {preview ? (
          <img src={preview} alt="preview" style={{ width: "100%", borderRadius: "8px", marginBottom: "16px", maxHeight: "200px", objectFit: "cover" }} />
        ) : (
          <label htmlFor="proof-input" style={{ display: "block", border: "1.5px dashed #2E4057", borderRadius: "10px", padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: "16px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>📎</div>
            <p style={{ color: "#9baab8", fontSize: "13px", margin: 0 }}>Klik untuk upload foto bukti transfer</p>
            <p style={{ color: "#5a6a7a", fontSize: "11px", margin: "4px 0 0" }}>JPG, PNG — maks. 2MB</p>
          </label>
        )}

        <input id="proof-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

        {preview && (
          <label htmlFor="proof-input" style={{ display: "block", textAlign: "center", color: "#9baab8", fontSize: "12px", cursor: "pointer", marginBottom: "16px" }}>
            Ganti foto
          </label>
        )}

        <button onClick={handleSubmit} disabled={loading || !file} style={{ width: "100%", background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "13px", fontSize: "14px", fontWeight: 500, cursor: loading || !file ? "not-allowed" : "pointer", opacity: loading || !file ? 0.6 : 1 }}>
          {loading ? "Mengirim..." : "Kirim Pembayaran"}
        </button>

        <button onClick={() => navigate("/my-orders")} style={{ width: "100%", background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "11px", fontSize: "13px", cursor: "pointer", marginTop: "10px" }}>
          Kembali
        </button>

      </div>
    </div>
  )
}

export default PaymentPage