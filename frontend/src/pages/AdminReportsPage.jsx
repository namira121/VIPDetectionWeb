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

  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  })

  const totalRevenue = reports.reduce((sum, r) => sum + r.total_revenue, 0)
  const totalOrders = reports.reduce((sum, r) => sum + r.total_orders, 0)

  const handleDownloadPdf = (report) => {
    const rows = report.orders.map((o, i) => `
      <tr style="border-bottom: 1px solid #e8e8e8;">
        <td style="padding: 10px 12px;">${i + 1}</td>
        <td style="padding: 10px 12px;">${o.event_name}</td>
        <td style="padding: 10px 12px;">${o.customer}</td>
        <td style="padding: 10px 12px;">${o.package}</td>
        <td style="padding: 10px 12px;">Rp ${Number(o.amount).toLocaleString("id-ID")}</td>
        <td style="padding: 10px 12px;">${formatDate(o.paid_at)}</td>
      </tr>
    `).join("")

    const html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Laporan ${formatMonth(report.month)}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; color: #1a1a1a; padding: 40px; }
          h1 { font-size: 22px; color: #0F1C2E; margin-bottom: 4px; }
          p { color: #666; font-size: 13px; margin: 0 0 24px; }
          .summary { display: flex; gap: 24px; margin-bottom: 32px; }
          .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px 20px; min-width: 150px; }
          .card-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
          .card-val { font-size: 18px; font-weight: 600; color: #0F1C2E; }
          .card-val.gold { color: #C6A75E; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead tr { background: #0F1C2E; color: white; }
          thead th { padding: 12px; text-align: left; font-weight: 500; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
          tbody tr:nth-child(even) { background: #f9f9f9; }
          .total-row { background: #0F1C2E !important; color: white; font-weight: 600; }
          .total-row td { padding: 12px; }
          footer { margin-top: 40px; font-size: 11px; color: #aaa; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Laporan Penjualan — ${formatMonth(report.month)}</h1>
        <p>Dicetak pada ${formatDate(new Date())}</p>
        <div class="summary">
          <div class="card">
            <div class="card-label">Total Order</div>
            <div class="card-val">${report.total_orders} order</div>
          </div>
          <div class="card">
            <div class="card-label">Total Revenue</div>
            <div class="card-val gold">Rp ${Number(report.total_revenue).toLocaleString("id-ID")}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Event</th><th>Customer</th><th>Paket</th><th>Amount</th><th>Tanggal Bayar</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td colspan="4">Total</td>
              <td>Rp ${Number(report.total_revenue).toLocaleString("id-ID")}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <footer>VIP Detection — Laporan dibuat otomatis oleh sistem</footer>
      </body>
      </html>
    `

    const win = window.open("", "_blank")
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
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
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Admin</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Laporan Penjualan</h1>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Revenue", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, color: "#C6A75E" },
            { label: "Total Orders Lunas", value: totalOrders, color: "#4ade80" },
            { label: "Total Bulan", value: reports.length, color: "#F5F2EC" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "rgba(232,223,210,0.04)", border: "0.5px solid rgba(198,167,94,0.18)", borderRadius: "12px", padding: "1.5rem" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500", margin: "0 0 0.6rem" }}>{label}</p>
              <p style={{ color, fontSize: "24px", fontWeight: "500", margin: 0, fontFamily: "Georgia, serif" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* MONTHLY REPORTS */}
        {reports.length === 0 ? (
          <p style={{ color: "rgba(232,223,210,0.35)", fontSize: "14px" }}>Belum ada data laporan</p>
        ) : (
          reports.map((report) => (
            <div key={report.month} style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "12px", marginBottom: "1rem", overflow: "hidden" }}>

              {/* Header bulan */}
              <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  onClick={() => setExpanded(expanded === report.month ? null : report.month)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", flex: 1 }}
                >
                  <div>
                    <span style={{ color: "#F5F2EC", fontSize: "15px", fontWeight: "500", fontFamily: "Georgia, serif" }}>{formatMonth(report.month)}</span>
                    <span style={{ color: "rgba(232,223,210,0.4)", fontSize: "12px", marginLeft: "10px" }}>{report.total_orders} order</span>
                  </div>
                  <span style={{ color: "#C6A75E", fontSize: "15px", fontWeight: "500", marginLeft: "auto", marginRight: "1rem" }}>
                    Rp {report.total_revenue.toLocaleString("id-ID")}
                  </span>
                  <span style={{ color: "rgba(232,223,210,0.4)", fontSize: "11px" }}>{expanded === report.month ? "▲" : "▼"}</span>
                </div>

                {/* Tombol Download */}
                <button
                  onClick={() => handleDownloadPdf(report)}
                  style={{ marginLeft: "1rem", background: "rgba(198,167,94,0.08)", color: "#C6A75E", border: "0.5px solid rgba(198,167,94,0.35)", borderRadius: "6px", padding: "7px 14px", fontSize: "11px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "'Segoe UI', sans-serif" }}
                >
                  Download PDF
                </button>
              </div>

              {/* Detail orders */}
              {expanded === report.month && (
                <div style={{ borderTop: "0.5px solid rgba(198,167,94,0.1)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "0.5px solid rgba(198,167,94,0.15)" }}>
                        {["Event", "Customer", "Paket", "Amount", "Tanggal Bayar"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", color: "#C6A75E", fontWeight: "500", textAlign: "left", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.orders.map((order, i) => (
                        <tr key={i} style={{ borderBottom: "0.5px solid rgba(198,167,94,0.06)" }}>
                          <td style={{ padding: "12px 16px", color: "#E8DFD2" }}>{order.event_name}</td>
                          <td style={{ padding: "12px 16px", color: "rgba(232,223,210,0.7)" }}>{order.customer}</td>
                          <td style={{ padding: "12px 16px", color: "rgba(232,223,210,0.7)" }}>{order.package}</td>
                          <td style={{ padding: "12px 16px", color: "#C6A75E", fontWeight: "500" }}>Rp {Number(order.amount).toLocaleString("id-ID")}</td>
                          <td style={{ padding: "12px 16px", color: "rgba(232,223,210,0.5)" }}>{formatDate(order.paid_at)}</td>
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