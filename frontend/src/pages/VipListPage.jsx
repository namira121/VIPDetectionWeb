import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"

function VipListPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [vips, setVips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVips = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:3000/vip/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setVips(res.data)
      } catch (err) {
        console.log("Gagal ambil data VIP:", err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchVips()
  }, [orderId])

  const handleDelete = async (vipId) => {
    if (!confirm("Yakin ingin menghapus foto VIP ini?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/vip/${vipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVips(vips.filter(v => v.id !== vipId))
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus")
    }
  }

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", borderBottom: "0.5px solid rgba(198,167,94,0.2)", background: "rgba(15,28,46,0.97)", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Detection</span>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/customer" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dashboard</Link>
          <Link to="/my-orders" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>My History</Link>
        </div>
      </nav>

      <div style={{ padding: "2.5rem", maxWidth: "900px", margin: "0 auto" }}>

        {/* PANAH BALIK + HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/my-orders"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(232,223,210,0.5)", textDecoration: "none", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1rem" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#C6A75E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,223,210,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Kembali ke Riwayat Order
          </Link>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Manajemen VIP</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: 0 }}>Daftar Tamu VIP</h1>
        </div>

        {loading ? (
          <p style={{ color: "rgba(232,223,210,0.4)", fontSize: "14px" }}>Memuat data...</p>
        ) : vips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "rgba(232,223,210,0.03)", border: "0.5px solid rgba(198,167,94,0.15)", borderRadius: "12px" }}>
            <p style={{ color: "rgba(232,223,210,0.4)", fontSize: "14px", marginBottom: "1rem" }}>
              Belum ada foto VIP yang diupload
            </p>
            <button
              onClick={() => navigate(`/upload-vip/${orderId}`)}
              style={{ background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}
            >
              Upload Sekarang
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: "rgba(232,223,210,0.4)", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {vips.length} tamu VIP terdaftar
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {vips.map((vip) => (
                <div key={vip.id} style={{
                  background: "rgba(232,223,210,0.03)",
                  border: "0.5px solid rgba(198,167,94,0.18)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {/* Garis emas atas */}
                  <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

                  <img
                    src={`http://localhost:3000/${vip.photo_path.replace(/\\/g, "/")}`}
                    alt={vip.name}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "12px" }}>
                    <p style={{ color: "#F5F2EC", fontSize: "13px", fontWeight: "500", margin: "0 0 10px", fontFamily: "Georgia, serif" }}>
                      {vip.name}
                    </p>
                    <button
                      onClick={() => handleDelete(vip.id)}
                      style={{ background: "transparent", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "6px 0", fontSize: "11px", cursor: "pointer", width: "100%", fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.04em" }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate(`/upload-vip/${orderId}`)}
              style={{ background: "rgba(198,167,94,0.08)", color: "#C6A75E", border: "0.5px solid rgba(198,167,94,0.35)", borderRadius: "8px", padding: "10px 24px", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", fontWeight: "500" }}
            >
              + Tambah VIP
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VipListPage