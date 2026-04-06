import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:3000/admin/reports", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setReports(res.data)
        if (res.data.length > 0) setExpanded(res.data[0].month)
      } catch (err) {
        console.log("Gagal ambil reports:", err.response?.data || err.message)
      }
    }
    fetchReports()
  }, [])

  const formatMonth = (key) => {
    const [year, month] = key.split("-")
    const names = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    return `${names[parseInt(month) - 1]} ${year}`
  }

  const totalRevenue = reports.reduce((sum, r) => sum + r.total_revenue, 0)
  const totalOrders = reports.reduce((sum, r) => sum + r.total_orders, 0)

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
        <h2 style={{ color: "#E8DFD2", fontSize: "22px", fontWeight: 500, margin: "0 0 24px" }}>Laporan Penjualan</h2>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, color: "#C6A75E" },
            { label: "Total Orders Lunas", value: totalOrders, color: "#4caf7d" },
            { label: "Total Bulan", value: reports.length, color: "#E8DFD2" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#1a2d42", border: "0.5px solid #2E4057", borderRadius: "12px", padding: "20px 24px" }}>
              <p style={{ color: "#9baab8", fontSize: "12px", margin: "0 0 8px" }}>{label}</p>
              <p style={{ color, fontSize: "22px", fontWeight: 500, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Monthly Reports */}
        {reports.length === 0 ? (
          <p style={{ color: "#9baab8" }}>Belum ada data laporan</p>
        ) : (
          reports.map((report) => (
            <div key={report.month} style={{ background: "#1a2d42", border: "0.5px solid #2E4057", borderRadius: "12px", marginBottom: "16px", overflow: "hidden" }}>

              {/* Header bulan */}
              <div
                onClick={() => setExpanded(expanded === report.month ? null : report.month)}
                style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <div>
                  <span style={{ color: "#E8DFD2", fontSize: "15px", fontWeight: 500 }}>{formatMonth(report.month)}</span>
                  <span style={{ color: "#9baab8", fontSize: "12px", marginLeft: "12px" }}>{report.total_orders} order</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ color: "#C6A75E", fontSize: "15px", fontWeight: 500 }}>
                    Rp {report.total_revenue.toLocaleString("id-ID")}
                  </span>
                  <span style={{ color: "#9baab8", fontSize: "12px" }}>{expanded === report.month ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Detail orders */}
              {expanded === report.month && (
                <div style={{ borderTop: "0.5px solid #2E4057" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "#0F1C2E" }}>
                        {["Event", "Customer", "Paket", "Amount", "Tanggal Bayar"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", color: "#C6A75E", fontWeight: 500, textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.orders.map((order, i) => (
                        <tr key={i} style={{ borderTop: "0.5px solid #2E405755", background: "#0a1520" }}>
                          <td style={{ padding: "12px 16px", color: "#E8DFD2" }}>{order.event_name}</td>
                          <td style={{ padding: "12px 16px", color: "#E8DFD2" }}>{order.customer}</td>
                          <td style={{ padding: "12px 16px", color: "#E8DFD2" }}>{order.package}</td>
                          <td style={{ padding: "12px 16px", color: "#C6A75E" }}>Rp {order.amount.toLocaleString("id-ID")}</td>
                          <td style={{ padding: "12px 16px", color: "#9baab8" }}>
                            {new Date(order.paid_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminReportsPage