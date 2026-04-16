import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminPackagesPage() {
  const [packages, setPackages] = useState([])
  const [editingPkg, setEditingPkg] = useState(null)
  const [form, setForm] = useState({ name: "", price: "", max_vip: "", max_hours: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchPackages() }, [])

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:3000/packages")
      setPackages(res.data)
    } catch (err) {
      console.log("Gagal ambil packages:", err.response?.data || err.message)
    }
  }

  const openEdit = (pkg) => {
    setEditingPkg(pkg)
    setForm({ name: pkg.name, price: pkg.price, max_vip: pkg.max_vip, max_hours: pkg.max_hours })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.max_vip || !form.max_hours) {
      alert("Semua field harus diisi")
      return
    }
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:3000/admin/packages/${editingPkg.id}`,
        {
          name: form.name,
          price: Number(form.price),
          max_vip: Number(form.max_vip),
          max_hours: Number(form.max_hours),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditingPkg(null)
      fetchPackages()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update package")
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Customers", path: "/admin/customers" },
    { label: "VIP Guests", path: "/admin/vip-guests" },
    { label: "Packages", path: "/admin/packages" },
    { label: "Reports", path: "/admin/reports" },
  ]

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(232,223,210,0.06)",
    border: "0.5px solid rgba(198,167,94,0.25)",
    borderRadius: "8px",
    color: "#E8DFD2",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#C6A75E",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block",
  }

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
      <div style={{ flex: 1, padding: "2.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Manajemen</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Kelola Paket Layanan</h1>
        </div>

        {/* PACKAGE CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem" }}>
          {packages.map((pkg) => (
            <div key={pkg.id} style={{ background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.18)", borderRadius: "14px", padding: "1.8rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

              <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.4rem", fontWeight: "500" }}>Paket</p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 1.2rem" }}>{pkg.name}</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.5rem" }}>
                {[
                  ["Harga", `Rp ${Number(pkg.price).toLocaleString("id-ID")}`],
                  ["Max VIP", `${pkg.max_vip} orang`],
                  ["Max Durasi", `${pkg.max_hours} jam`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "0.5px solid rgba(198,167,94,0.08)", paddingBottom: "8px" }}>
                    <span style={{ color: "rgba(232,223,210,0.45)" }}>{label}</span>
                    <span style={{ color: "#F5F2EC", fontWeight: "500" }}>{val}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openEdit(pkg)}
                style={{ width: "100%", background: "rgba(198,167,94,0.1)", color: "#C6A75E", border: "0.5px solid rgba(198,167,94,0.35)", borderRadius: "8px", padding: "10px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}
              >
                Edit Paket
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EDIT */}
      {editingPkg && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#0F1C2E", border: "0.5px solid rgba(198,167,94,0.25)", borderRadius: "16px", padding: "2rem", width: "420px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Edit</p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 1.5rem" }}>Paket {editingPkg.name}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Nama Paket</label>
                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama paket" />
              </div>
              <div>
                <label style={labelStyle}>Harga (Rp)</label>
                <input style={inputStyle} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Contoh: 1500000" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Max VIP (orang)</label>
                  <input style={inputStyle} type="number" value={form.max_vip} onChange={(e) => setForm({ ...form, max_vip: e.target.value })} placeholder="15" />
                </div>
                <div>
                  <label style={labelStyle}>Max Durasi (jam)</label>
                  <input style={inputStyle} type="number" value={form.max_hours} onChange={(e) => setForm({ ...form, max_hours: e.target.value })} placeholder="3" />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleSave} disabled={loading}
                style={{ flex: 1, background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "12px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button onClick={() => setEditingPkg(null)}
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

export default AdminPackagesPage