import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/orders/my", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.log("Gagal ambil order")
    }
  }

  const handleCancel = async (orderId) => {
    if (!confirm("Yakin ingin membatalkan order ini?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.patch(`http://localhost:3000/orders/${orderId}/cancel`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan order")
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  })

  const statusColor = (s) => ({
    paid: { bg: "rgba(74,222,128,0.1)", color: "#4ade80", border: "rgba(74,222,128,0.3)" },
    pending: { bg: "rgba(198,167,94,0.1)", color: "#C6A75E", border: "rgba(198,167,94,0.3)" },
    cancelled: { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
  }[s] || { bg: "rgba(232,223,210,0.1)", color: "#E8DFD2", border: "rgba(232,223,210,0.2)" })

  const btnBase = {
    width: "160px",
    padding: "9px 0",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    letterSpacing: "0.04em",
    textAlign: "center",
    whiteSpace: "nowrap",
  }

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", position: "relative" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", borderBottom: "0.5px solid rgba(198,167,94,0.2)", background: "rgba(15,28,46,0.97)", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Detection</span>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/customer" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dashboard</Link>
          <Link to="/order" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>New Order</Link>
          <Link to="/my-orders" style={{ fontSize: "12px", color: "#C6A75E", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>My History</Link>
        </div>
      </nav>

      <div style={{ padding: "2.5rem" }}>

        {/* PANAH BALIK + HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/customer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(232,223,210,0.5)", textDecoration: "none", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#C6A75E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,223,210,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Kembali ke Dashboard
          </Link>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Riwayat</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Order Saya</h1>
        </div>

        {/* LIST ORDER */}
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(232,223,210,0.35)", fontSize: "14px" }}>
            Belum ada order
          </div>
        ) : (
          orders.map((order) => {
            const sc = statusColor(order.status)
            return (
              <div key={order.id} style={{
                background: "rgba(232,223,210,0.03)",
                border: "0.5px solid rgba(198,167,94,0.15)",
                borderRadius: "12px",
                padding: "1.5rem 2rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "2rem",
              }}>

                {/* INFO */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", color: "#F5F2EC", fontSize: "16px", fontFamily: "Georgia, serif", fontWeight: "500" }}>
                    {order.event_name}
                  </p>
                  <p style={{ margin: "0 0 4px", color: "rgba(232,223,210,0.55)", fontSize: "13px" }}>
                    {formatDate(order.event_date)}
                  </p>
                  <p style={{ margin: "0 0 10px", color: "rgba(232,223,210,0.55)", fontSize: "13px" }}>
                    {order.Package?.name} — Rp {Number(order.Package?.price).toLocaleString("id-ID")}
                  </p>
                  <span style={{
                    fontSize: "11px", padding: "3px 12px", borderRadius: "20px",
                    background: sc.bg, color: sc.color, border: `0.5px solid ${sc.border}`,
                    letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: "500"
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* TOMBOL */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>

                  {order.status === "pending" ? (
                    <>
                      <button
                        onClick={() => navigate(`/payment/${order.id}`)}
                        style={{ ...btnBase, background: "#C6A75E", color: "#0F1C2E", border: "none" }}
                      >
                        Bayar Sekarang
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        style={{ ...btnBase, background: "transparent", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)" }}
                      >
                        Cancel Order
                      </button>
                    </>
                  ) : order.status === "paid" ? (
                    <>
                      <button
                        onClick={() => navigate(`/upload-vip/${order.id}`)}
                        style={{ ...btnBase, background: "rgba(46,64,87,0.8)", color: "#E8DFD2", border: "0.5px solid rgba(198,167,94,0.3)" }}
                      >
                        Upload Foto VIP
                      </button>
                      <button
                        onClick={() => navigate(`/vip-list/${order.id}`)}
                        style={{ ...btnBase, background: "rgba(46,64,87,0.8)", color: "#E8DFD2", border: "0.5px solid rgba(198,167,94,0.3)" }}
                      >
                        Daftar Foto VIP
                      </button>
                      <button
                        onClick={() => navigate(`/barcode/${order.id}`)}
                        style={{ ...btnBase, background: "rgba(198,167,94,0.12)", color: "#C6A75E", border: "0.5px solid rgba(198,167,94,0.5)" }}
                      >
                        Cetak Barcode
                      </button>
                    </>
                  ) : (
                    <button disabled style={{ ...btnBase, background: "transparent", color: "rgba(232,223,210,0.25)", border: "0.5px solid rgba(232,223,210,0.1)", cursor: "not-allowed" }}>
                      Dibatalkan
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage