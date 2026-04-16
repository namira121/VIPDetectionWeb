import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalOrders: 0, totalCustomers: 0, totalVips: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const [statsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:3000/admin/dashboard-stats", { headers }),
          fetch("http://localhost:3000/admin/recent-orders", { headers }),
        ])

        const statsData = await statsRes.json()
        const ordersData = await ordersRes.json()

        console.log("STATS:", statsData)
        console.log("ORDERS:", ordersData)

        setStats(statsData)
        setRecentOrders(ordersData)
      } catch (err) {
        console.error("Gagal fetch admin dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val)

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

  const statusColor = (status) => {
    if (status === "paid") return "#4ade80"
    if (status === "pending") return "#facc15"
    if (status === "cancelled") return "#f87171"
    return "#E8DFD2"
  }

  const statCards = [
    {
      label: "Total Orders",
      value: loading ? "..." : stats.totalOrders,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Total Customers",
      value: loading ? "..." : stats.totalCustomers,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "VIP Guests",
      value: loading ? "..." : stats.totalVips,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: "Revenue",
      value: loading ? "..." : formatRupiah(stats.revenue),
      isRevenue: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F1C2E", fontFamily: "'Segoe UI', sans-serif", color: "#E8DFD2" }}>

      {/* SIDEBAR */}
      <div style={{ width: "220px", flexShrink: 0, background: "#0a1628", borderRight: "0.5px solid rgba(198,167,94,0.15)", display: "flex", flexDirection: "column", padding: "2rem 0", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "0 1.5rem 2rem" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Admin</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", padding: "0 0.75rem" }}>
          {[
            { label: "Dashboard", path: "/admin" },
            { label: "Orders", path: "/admin/orders" },
            { label: "Customers", path: "/admin/customers" },
            { label: "VIP Guests", path: "/admin/vip-guests" },
            { label: "Packages", path: "/admin/packages" },
            { label: "Reports", path: "/admin/reports" },
          ].map((item) => {
            const isActive = window.location.pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? "500" : "400",
                  color: isActive ? "#C6A75E" : "rgba(232,223,210,0.55)",
                  background: isActive ? "rgba(198,167,94,0.1)" : "transparent",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s",
                }}
              >
                {item.label}
              </div>
            )
          })}
        </div>

        <div style={{ padding: "1rem 0.75rem" }}>
          <button
            onClick={handleLogout}
            style={{ width: "100%", padding: "10px", border: "0.5px solid rgba(198,167,94,0.4)", borderRadius: "8px", background: "transparent", color: "#C6A75E", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "2.5rem", overflowY: "auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.4rem", fontWeight: "500" }}>Overview</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Admin Dashboard</h1>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ background: "rgba(232,223,210,0.04)", border: "0.5px solid rgba(198,167,94,0.18)", borderRadius: "12px", padding: "1.5rem", position: "relative" }}>
              <div style={{ position: "absolute", right: "1.2rem", top: "1.2rem", width: "36px", height: "36px", borderRadius: "8px", background: "rgba(198,167,94,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {card.icon}
              </div>
              <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500", margin: "0 0 0.6rem" }}>{card.label}</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: card.isRevenue ? "22px" : "38px", fontWeight: "500", color: "#F5F2EC", lineHeight: "1", margin: "0 0 0.4rem" }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* RECENT ORDERS */}
        <div>
          <div style={{ marginBottom: "1.2rem" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem" }}>Terbaru</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Recent Orders</h2>
          </div>

          <div style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid rgba(198,167,94,0.2)" }}>
                  {["Customer", "Package", "Event", "Date", "Status"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "rgba(232,223,210,0.35)", fontSize: "13px" }}>Memuat data...</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "rgba(232,223,210,0.35)", fontSize: "13px" }}>Belum ada order</td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <tr key={i} style={{ borderBottom: "0.5px solid rgba(198,167,94,0.07)" }}>
                      <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{order.Customer?.name || "-"}</td>
                      <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.7)" }}>{order.Package?.name || "-"}</td>
                      <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.7)" }}>{order.event_name}</td>
                      <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.7)" }}>{formatDate(order.event_date)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "500", color: statusColor(order.status), background: `${statusColor(order.status)}18`, padding: "4px 10px", borderRadius: "20px", textTransform: "capitalize" }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard