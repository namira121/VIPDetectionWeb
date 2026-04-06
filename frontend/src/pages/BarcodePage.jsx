import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import QRCode from "qrcode"

function BarcodePage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (order && canvasRef.current) {
      const qrData = JSON.stringify({
        order_id: order.id,
        event_name: order.event_name,
        event_date: order.event_date,
      })

      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 250,
        margin: 2,
        color: {
          dark: "#0F1C2E",
          light: "#F5F2EC",
        }
      })
    }
  }, [order])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#9baab8" }}>Memuat...</p>
    </div>
  )

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>

      <div style={{ background: "#0F1C2E", minHeight: "100vh", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif" }}>

        {/* Tombol kembali & print */}
        <div className="no-print" style={{ display: "flex", gap: "12px", marginBottom: "32px", alignSelf: "flex-start" }}>
          <button onClick={() => navigate(-1)}
            style={{ background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>
            ← Kembali
          </button>
          <button onClick={handlePrint}
            style={{ background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "8px 20px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            🖨 Cetak Barcode
          </button>
        </div>

        {/* Kartu barcode */}
        <div className="print-card" style={{
          background: "#F5F2EC", borderRadius: "16px",
          padding: "40px 48px", textAlign: "center",
          border: "0.5px solid #2E4057", maxWidth: "380px", width: "100%"
        }}>
          <p style={{ color: "#9baab8", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px" }}>
            VIP Detection System
          </p>
          <h2 style={{ color: "#0F1C2E", fontSize: "20px", fontWeight: 500, margin: "0 0 4px" }}>
            {order?.event_name}
          </h2>
          <p style={{ color: "#5a6a7a", fontSize: "13px", margin: "0 0 24px" }}>
            {order?.event_date} • {order?.location}
          </p>

          {/* QR Code */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <canvas ref={canvasRef} style={{ borderRadius: "8px" }} />
          </div>

          <div style={{ borderTop: "0.5px solid #ccc", paddingTop: "16px" }}>
            <p style={{ color: "#5a6a7a", fontSize: "11px", margin: "0 0 4px" }}>Order ID</p>
            <p style={{ color: "#0F1C2E", fontSize: "16px", fontWeight: 500, margin: 0, letterSpacing: "2px" }}>
              #{String(order?.id).padStart(6, "0")}
            </p>
          </div>

          <p style={{ color: "#9baab8", fontSize: "10px", margin: "16px 0 0" }}>
            Scan QR code ini menggunakan aplikasi VIP Detection
          </p>
        </div>

      </div>
    </>
  )
}

export default BarcodePage