import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

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
      await axios.patch(
        `http://localhost:3000/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan order")
    }
  }

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#E8DFD2", fontSize: "22px", fontWeight: 500, marginBottom: "24px" }}>
        Order Saya
      </h2>

      {orders.length === 0 ? (
        <p style={{ color: "#9baab8" }}>Belum ada order</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{
            background: "#1a2d42",
            border: "0.5px solid #2E4057",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px"
          }}>
            {/* Info Order */}
            <div>
              <p style={{ margin: "0 0 6px", color: "#E8DFD2", fontSize: "14px" }}>
                <b style={{ color: "#C6A75E", fontWeight: 500 }}>Event:</b> {order.event_name}
              </p>
              <p style={{ margin: "0 0 6px", color: "#E8DFD2", fontSize: "14px" }}>
                <b style={{ color: "#C6A75E", fontWeight: 500 }}>Tanggal:</b>{" "}
                <span style={{ color: "#9baab8" }}>{order.event_date}</span>
              </p>
              <p style={{ margin: "0 0 10px", color: "#E8DFD2", fontSize: "14px" }}>
                <b style={{ color: "#C6A75E", fontWeight: 500 }}>Paket:</b>{" "}
                <span style={{ color: "#9baab8" }}>
                  {order.Package?.name} — Rp {Number(order.Package?.price).toLocaleString("id-ID")}
                </span>
              </p>
              <span style={{
                fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                background: order.status === "paid" ? "#0d2a1a" : order.status === "cancelled" ? "#2a1a1a" : "#2a2a1a",
                color: order.status === "paid" ? "#4caf7d" : order.status === "cancelled" ? "#e06c6c" : "#C6A75E",
                border: `0.5px solid ${order.status === "paid" ? "#4caf7d55" : order.status === "cancelled" ? "#e06c6c55" : "#C6A75E55"}`
              }}>
                {order.status}
              </span>
            </div>

            {/* Tombol */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>

              {/* Tombol Bayar */}
              {order.status === "pending" ? (
                <button
                  onClick={() => navigate(`/payment/${order.id}`)}
                  style={{
                    background: "#C6A75E", color: "#0F1C2E", border: "none",
                    borderRadius: "8px", padding: "10px 20px", fontSize: "13px",
                    fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap"
                  }}
                >
                  Bayar Sekarang
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    background: "transparent", color: "#5a6a7a",
                    border: "0.5px solid #2E4057", borderRadius: "8px",
                    padding: "10px 20px", fontSize: "13px",
                    fontWeight: 500, cursor: "not-allowed", whiteSpace: "nowrap"
                  }}
                >
                  {order.status === "paid" ? "Sudah Dibayar" : "Dibatalkan"}
                </button>
              )}

              {/* Tombol Cancel */}
              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order.id)}
                  style={{
                    background: "transparent", color: "#e06c6c",
                    border: "0.5px solid #e06c6c55", borderRadius: "8px",
                    padding: "8px 20px", fontSize: "12px",
                    cursor: "pointer", whiteSpace: "nowrap"
                  }}
                >
                  Cancel Order
                </button>
              )}

              {/* Tombol Upload Foto VIP */}
              {order.status === "paid" && (
                <>
                  <button
                    onClick={() => navigate(`/upload-vip/${order.id}`)}
                    style={{
                      background: "#2E4057", color: "#E8DFD2",
                      border: "0.5px solid #C6A75E55", borderRadius: "8px",
                      padding: "8px 20px", fontSize: "12px",
                      cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    Upload Foto VIP
                  </button>

                  {/* ← tambah ini */}
                  <button
                    onClick={() => navigate(`/vip-list/${order.id}`)}
                    style={{
                      background: "#2E4057", color: "#E8DFD2",
                      border: "0.5px solid #2E4057", borderRadius: "8px",
                      padding: "8px 20px", fontSize: "12px",
                      cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    Daftar Foto VIP
                  </button>

                  {/* ← tambah ini */}
                  <button
                    onClick={() => navigate(`/barcode/${order.id}`)}
                    style={{
                      background: "#C6A75E22", color: "#C6A75E",
                      border: "0.5px solid #C6A75E", borderRadius: "8px",
                      padding: "8px 20px", fontSize: "12px",
                      cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    Cetak Barcode
                  </button>
                </>
              )}

            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrdersPage