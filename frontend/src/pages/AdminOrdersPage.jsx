import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchOrders() }, [])

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

  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  })

  const statusBadge = (status, type = "order") => {
    const map = type === "order"
      ? {
          pending:   { bg: "rgba(198,167,94,0.1)", color: "#C6A75E", border: "rgba(198,167,94,0.3)" },
          paid:      { bg: "rgba(74,222,128,0.1)", color: "#4ade80", border: "rgba(74,222,128,0.3)" },
          cancelled: { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
        }
      : {
          pending:  { bg: "rgba(198,167,94,0.1)", color: "#C6A75E", border: "rgba(198,167,94,0.3)" },
          approved: { bg: "rgba(74,222,128,0.1)", color: "#4ade80", border: "rgba(74,222,128,0.3)" },
          failed:   { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
        }
    const s = map[status] || map.pending
    return (
      <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: s.bg, color: s.color, border: `0.5px solid ${s.border}`, letterSpacing: "0.04em", textTransform: "capitalize", fontWeight: "500", whiteSpace: "nowrap" }}>
        {status}
      </span>
    )
  }

  const navItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Customers", path: "/admin/customers" },
    { label: "VIP Guests", path: "/admin/vip-guests" },
    { label: "Reports", path: "/admin/reports" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F1C2E", fontFamily: "'Segoe UI', sans-serif", color: "#E8DFD2" }}>

      {/* SIDEBAR */}
      <div style={{ width: "220px", flexShrink: 0, background: "#0a1628", borderRight: "0.5px solid rgba(198,167,94,0.15)", display: "flex", flexDirection: "column", padding: "2rem 0", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 1.5rem 2rem" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Admin</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 0.75rem", marginBottom: "2rem" }}>
          {navItems.map((item) => {
            const isActive = window.location.pathname === item.path
            return (
              <div key={item.path} onClick={() => navigate(item.path)} style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: isActive ? "500" : "400", color: isActive ? "#C6A75E" : "rgba(232,223,210,0.55)", background: isActive ? "rgba(198,167,94,0.1)" : "transparent", cursor: "pointer" }}>
                {item.label}
              </div>
            )
          })}
        </div>
        <div style={{ padding: "0 0.75rem", marginTop: "auto" }}>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/") }}
            style={{ width: "100%", padding: "10px", border: "0.5px solid rgba(198,167,94,0.4)", borderRadius: "8px", background: "transparent", color: "#C6A75E", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "2.5rem", overflowX: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Manajemen</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Daftar Orders</h1>
        </div>

        <div style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(198,167,94,0.2)" }}>
                {["#", "Customer", "Event", "Paket", "Total", "Tanggal", "Status Order", "Status Bayar", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", color: "#C6A75E", fontWeight: "500", textAlign: "left", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "2rem", textAlign: "center", color: "rgba(232,223,210,0.35)", fontSize: "13px" }}>Belum ada order</td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: "0.5px solid rgba(198,167,94,0.07)" }}>
                    <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.4)", fontSize: "12px" }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#E8DFD2", fontWeight: "500" }}>{order.Customer?.name}</div>
                      <div style={{ color: "#C6A75E", fontSize: "11px" }}>{order.Customer?.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{order.event_name}</td>
                    <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.7)" }}>{order.Package?.name}</td>
                    <td style={{ padding: "14px 16px", color: "#C6A75E", fontWeight: "500" }}>Rp {Number(order.total_amount).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.7)" }}>{formatDate(order.event_date)}</td>
                    <td style={{ padding: "14px 16px" }}>{statusBadge(order.status, "order")}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {order.Payment
                        ? statusBadge(order.Payment.payment_status, "payment")
                        : <span style={{ color: "rgba(232,223,210,0.3)", fontSize: "12px" }}>Belum bayar</span>
                      }
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {order.Payment && order.Payment.payment_status === "pending" && (
                          <button onClick={() => setSelectedOrder(order)}
                            style={{ background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "11px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                            Verifikasi
                          </button>
                        )}
                        <button onClick={() => handleDelete(order.id)}
                          style={{ background: "transparent", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>
                          ✕
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

      {/* MODAL VERIFIKASI */}
      {selectedOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#0F1C2E", border: "0.5px solid rgba(198,167,94,0.25)", borderRadius: "16px", padding: "2rem", width: "440px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Verifikasi</p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 1.5rem" }}>Konfirmasi Pembayaran</h3>

            <div style={{ background: "rgba(232,223,210,0.04)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.2rem" }}>
              {[
                ["Customer", selectedOrder.Customer?.name],
                ["Event", selectedOrder.event_name],
                ["Paket", selectedOrder.Package?.name],
                ["Total", `Rp ${Number(selectedOrder.total_amount).toLocaleString("id-ID")}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "rgba(232,223,210,0.45)" }}>{label}</span>
                  <span style={{ color: "#E8DFD2", fontWeight: "500" }}>{val}</span>
                </div>
              ))}
            </div>

            {selectedOrder.Payment?.proof_path && (
              <div style={{ marginBottom: "1.2rem" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500", margin: "0 0 8px" }}>Bukti Transfer</p>
                <img
                  src={`http://localhost:3000/${selectedOrder.Payment.proof_path.replace(/\\/g, "/")}`}
                  alt="bukti"
                  style={{ width: "100%", borderRadius: "8px", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleVerify(selectedOrder.Payment.id, "approved")} disabled={loadingAction}
                style={{ flex: 1, background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "0.5px solid rgba(74,222,128,0.3)", borderRadius: "8px", padding: "12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.06em" }}>
                Approve
              </button>
              <button onClick={() => handleVerify(selectedOrder.Payment.id, "failed")} disabled={loadingAction}
                style={{ flex: 1, background: "rgba(248,113,113,0.15)", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "8px", padding: "12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.06em" }}>
                Deny
              </button>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: "transparent", color: "rgba(232,223,210,0.4)", border: "0.5px solid rgba(232,223,210,0.15)", borderRadius: "8px", padding: "12px 16px", fontSize: "12px", cursor: "pointer" }}>
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