import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.log("Gagal ambil orders:", err.response?.data || err.message)
    }
  }

  const handleVerify = async (paymentId, status) => {
    try {
      setLoadingAction(true)
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:3000/admin/payments/${paymentId}/verify`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSelectedOrder(null)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update status")
    } finally {
      setLoadingAction(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending:   { background: "#2a2a1a", color: "#C6A75E", border: "0.5px solid #C6A75E55" },
      paid:      { background: "#0d2a1a", color: "#4caf7d", border: "0.5px solid #4caf7d55" },
      cancelled: { background: "#2a1a1a", color: "#e06c6c", border: "0.5px solid #e06c6c55" },
    }
    const s = styles[status] || styles.pending
    return (
      <span style={{ ...s, fontSize: "12px", padding: "3px 10px", borderRadius: "20px" }}>
        {status}
      </span>
    )
  }

  const getPaymentBadge = (status) => {
    const styles = {
      pending:  { background: "#2a2a1a", color: "#C6A75E", border: "0.5px solid #C6A75E55" },
      approved: { background: "#0d2a1a", color: "#4caf7d", border: "0.5px solid #4caf7d55" },
      failed:   { background: "#2a1a1a", color: "#e06c6c", border: "0.5px solid #e06c6c55" },
    }
    const s = styles[status] || styles.pending
    return (
      <span style={{ ...s, fontSize: "12px", padding: "3px 10px", borderRadius: "20px" }}>
        {status}
      </span>
    )
  }

  const handleDelete = async (orderId) => {
  if (!confirm("Yakin ingin menghapus order ini?")) return
  try {
    const token = localStorage.getItem("token")
    await axios.delete(`http://localhost:3000/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchOrders()
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menghapus order")
  }
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F1C2E", fontFamily: "sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: "220px", background: "#1a2d42", borderRight: "0.5px solid #2E4057", padding: "32px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h2 style={{ color: "#C6A75E", fontSize: "20px", fontWeight: 500, margin: "0 0 40px" }}>VIP Admin</h2>
          {[
            { label: "Dashboard", path: "/admin" },
            { label: "Orders", path: "/admin/orders" },
            { label: "Customers", path: "/admin/customers" },
            { label: "VIP Guests", path: "/admin/vip-guests" },
            { label: "Reports", path: "/admin/reports" },
          ].map(({ label, path }) => (
            <p key={label} onClick={() => navigate(path)} style={{
              color: window.location.pathname === path ? "#C6A75E" : "#E8DFD2",
              fontSize: "14px", cursor: "pointer", padding: "10px 12px",
              borderRadius: "8px", margin: "2px 0",
              background: window.location.pathname === path ? "#0F1C2E" : "transparent",
            }}>
              {label}
            </p>
          ))}
        </div>
        <button onClick={() => { localStorage.removeItem("token"); navigate("/") }}
          style={{ background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "10px", cursor: "pointer", fontSize: "13px" }}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "40px", background: "#0F1C2E" }}>
        <h2 style={{ color: "#E8DFD2", fontSize: "22px", fontWeight: 500, margin: "0 0 24px" }}>Daftar Orders</h2>

        <div style={{ border: "0.5px solid #2E4057", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#1a2d42", borderBottom: "0.5px solid #2E4057" }}>
                {["#", "Customer", "Event", "Paket", "Total", "Tanggal", "Status Order", "Status Bayar", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", color: "#0F1C2E", fontWeight: 500, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr style={{ background: "#0F1C2E" }}>
                  <td colSpan={9} style={{ padding: "24px", textAlign: "center", color: "#9baab8" }}>Belum ada order</td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={order.id} style={{
                    borderBottom: "0.5px solid #2E405755",
                    background: "#0F1C2E",
                  }}>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#E8DFD2" }}>{order.Customer?.name}</div>
                      <div style={{ color: "#C6A75E", fontSize: "11px" }}>{order.Customer?.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{order.event_name}</td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{order.Package?.name}</td>
                    <td style={{ padding: "14px 16px", color: "#C6A75E" }}>Rp {Number(order.total_amount).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{order.event_date}</td>
                    <td style={{ padding: "14px 16px" }}>{getStatusBadge(order.status)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {order.Payment
                        ? getPaymentBadge(order.Payment.payment_status)
                        : <span style={{ color: "#E8DFD2", fontSize: "12px" }}>Belum bayar</span>
                      }
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {order.Payment && order.Payment.payment_status === "pending" && (
                            <button onClick={() => setSelectedOrder(order)}
                              style={{ background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>
                              Verifikasi
                            </button>
                          )}
                          <button onClick={() => handleDelete(order.id)}
                            style={{ background: "transparent", color: "#e06c6c", border: "0.5px solid #e06c6c55", borderRadius: "6px", padding: "6px 10px", fontSize: "14px", cursor: "pointer" }}>
                            🗑
                          </button>
                        </div>
                      </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL */}
      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#1a2d42", border: "0.5px solid #2E4057", borderRadius: "16px", padding: "32px", width: "440px" }}>
            <h3 style={{ color: "#E8DFD2", fontSize: "18px", fontWeight: 500, margin: "0 0 20px" }}>Verifikasi Pembayaran</h3>

            <div style={{ background: "#0F1C2E", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              {[
                ["Customer", selectedOrder.Customer?.name],
                ["Event", selectedOrder.event_name],
                ["Paket", selectedOrder.Package?.name],
                ["Total", `Rp ${Number(selectedOrder.total_amount).toLocaleString("id-ID")}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "#9baab8" }}>{label}</span>
                  <span style={{ color: "#E8DFD2", fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            {selectedOrder.Payment?.proof_path && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#9baab8", fontSize: "12px", margin: "0 0 8px" }}>Bukti Transfer</p>
                <img
                  src={`http://localhost:3000/${selectedOrder.Payment.proof_path.replace(/\\/g, "/")}`}
                  alt="bukti"
                  style={{ width: "100%", borderRadius: "8px", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleVerify(selectedOrder.Payment.id, "approved")} disabled={loadingAction}
                style={{ flex: 1, background: "#4caf7d", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                ✓ Approve
              </button>
              <button onClick={() => handleVerify(selectedOrder.Payment.id, "failed")} disabled={loadingAction}
                style={{ flex: 1, background: "#e06c6c", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                ✗ Deny
              </button>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", cursor: "pointer" }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage