import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminVipGuestsPage() {
  const [vips, setVips] = useState([])
  const [selectedVip, setSelectedVip] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVips()
  }, [])

  const fetchVips = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/admin/vip-guests", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVips(res.data)
    } catch (err) {
      console.log("Gagal ambil VIP guests:", err.response?.data || err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus VIP guest ini?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/admin/vip-guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedVip(null)
      fetchVips()
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus VIP guest")
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
        <h2 style={{ color: "#E8DFD2", fontSize: "22px", fontWeight: 500, margin: "0 0 24px" }}>Daftar VIP Guests</h2>

        <div style={{ border: "0.5px solid #2E4057", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#1a2d42", borderBottom: "0.5px solid #2E4057" }}>
                {["#", "Foto", "Nama", "Event", "Customer", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", color: "#0F1C2E", fontWeight: 500, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vips.length === 0 ? (
                <tr style={{ background: "#0F1C2E" }}>
                  <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#9baab8" }}>Belum ada VIP guest</td>
                </tr>
              ) : (
                vips.map((vip, i) => (
                  <tr key={vip.id} style={{ borderBottom: "0.5px solid #2E405755", background: "#0F1C2E" }}>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{i + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <img
                        src={`http://localhost:3000/${vip.photo_path.replace(/\\/g, "/")}`}
                        alt={vip.name}
                        style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    </td>
                    <td style={{ padding: "14px 16px", color: "#E8DFD2" }}>{vip.name}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#E8DFD2" }}>{vip.Order?.event_name}</div>
                      <div style={{ color: "#9baab8", fontSize: "11px" }}>{vip.Order?.event_date}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "#E8DFD2" }}>{vip.Order?.Customer?.name}</div>
                      <div style={{ color: "#C6A75E", fontSize: "11px" }}>{vip.Order?.Customer?.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setSelectedVip(vip)}
                          style={{ background: "#2E4057", color: "#E8DFD2", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
                          Detail
                        </button>
                        <button onClick={() => handleDelete(vip.id)}
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

      {/* POPUP DETAIL */}
      {selectedVip && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#1a2d42", border: "0.5px solid #2E4057", borderRadius: "16px", padding: "32px", width: "420px" }}>
            <h3 style={{ color: "#E8DFD2", fontSize: "18px", fontWeight: 500, margin: "0 0 20px" }}>Detail VIP Guest</h3>

            <img
              src={`http://localhost:3000/${selectedVip.photo_path.replace(/\\/g, "/")}`}
              alt={selectedVip.name}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", marginBottom: "16px" }}
            />

            <div style={{ background: "#0F1C2E", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              {[
                ["Nama VIP", selectedVip.name],
                ["Event", selectedVip.Order?.event_name],
                ["Tanggal", selectedVip.Order?.event_date],
                ["Customer", selectedVip.Order?.Customer?.name],
                ["Email", selectedVip.Order?.Customer?.email],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: "#9baab8" }}>{label}</span>
                  <span style={{ color: "#E8DFD2", fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleDelete(selectedVip.id)}
                style={{ flex: 1, background: "#e06c6c", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                🗑 Hapus VIP Guest
              </button>
              <button onClick={() => setSelectedVip(null)}
                style={{ background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", cursor: "pointer" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVipGuestsPage