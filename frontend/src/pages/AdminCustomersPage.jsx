import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/admin/customers", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomers(res.data)
    } catch (err) {
      console.log("Gagal ambil customers:", err.response?.data || err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus customer ini?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/admin/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedCustomer(null)
      fetchCustomers()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus customer")
    }
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
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Daftar Customers</h1>
        </div>

        <div style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(198,167,94,0.2)" }}>
                {["#", "Nama", "Email", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", color: "#C6A75E", fontWeight: "500", textAlign: "left", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "rgba(232,223,210,0.35)", fontSize: "13px" }}>Belum ada customer</td>
                </tr>
              ) : (
                customers.map((customer, i) => (
                  <tr key={customer.id} style={{ borderBottom: "0.5px solid rgba(198,167,94,0.07)" }}>
                    <td style={{ padding: "14px 16px", color: "rgba(232,223,210,0.4)", fontSize: "12px" }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2", fontWeight: "500" }}>{customer.name}</td>
                    <td style={{ padding: "14px 16px", color: "#C6A75E" }}>{customer.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => setSelectedCustomer(customer)}
                          style={{ background: "rgba(46,64,87,0.8)", color: "#E8DFD2", border: "0.5px solid rgba(198,167,94,0.2)", borderRadius: "6px", padding: "6px 14px", fontSize: "11px", fontWeight: "500", cursor: "pointer", letterSpacing: "0.04em" }}>
                          Detail
                        </button>
                        <button onClick={() => handleDelete(customer.id)}
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

      {/* MODAL DETAIL */}
      {selectedCustomer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#0F1C2E", border: "0.5px solid rgba(198,167,94,0.25)", borderRadius: "16px", padding: "2rem", width: "400px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Detail</p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 1.5rem" }}>Informasi Customer</h3>

            <div style={{ background: "rgba(232,223,210,0.04)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.5rem" }}>
              {[
                ["ID", `#${String(selectedCustomer.id).padStart(4, "0")}`],
                ["Nama", selectedCustomer.name],
                ["Email", selectedCustomer.email],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "10px" }}>
                  <span style={{ color: "rgba(232,223,210,0.45)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500" }}>{label}</span>
                  <span style={{ color: "#E8DFD2", fontWeight: "500" }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleDelete(selectedCustomer.id)}
                style={{ flex: 1, background: "rgba(248,113,113,0.1)", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "8px", padding: "12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.06em" }}>
                Hapus Customer
              </button>
              <button onClick={() => setSelectedCustomer(null)}
                style={{ background: "transparent", color: "rgba(232,223,210,0.4)", border: "0.5px solid rgba(232,223,210,0.15)", borderRadius: "8px", padding: "12px 16px", fontSize: "12px", cursor: "pointer" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCustomersPage