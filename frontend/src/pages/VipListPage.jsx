import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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
        console.log(res.data)  // ← tambah ini
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
    <div style={{ background: "#0F1C2E", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <button onClick={() => navigate(-1)}
            style={{ background: "transparent", color: "#9baab8", border: "0.5px solid #2E4057", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>
            ← Kembali
          </button>
          <h2 style={{ color: "#E8DFD2", fontSize: "20px", fontWeight: 500, margin: 0 }}>
            Daftar Tamu VIP
          </h2>
        </div>

        {loading ? (
          <p style={{ color: "#9baab8" }}>Memuat data...</p>
        ) : vips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#9baab8", fontSize: "15px" }}>Belum ada foto VIP yang diupload</p>
            <button onClick={() => navigate(`/upload-vip/${orderId}`)}
              style={{ background: "#C6A75E", color: "#0F1C2E", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "13px", fontWeight: 500, cursor: "pointer", marginTop: "16px" }}>
              Upload Sekarang
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: "#9baab8", fontSize: "13px", marginBottom: "24px" }}>
              {vips.length} tamu VIP terdaftar
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {vips.map((vip) => (
                <div key={vip.id} style={{
                  background: "#1a2d42", border: "0.5px solid #2E4057",
                  borderRadius: "12px", overflow: "hidden"
                }}>
                  <img
                    src={`http://localhost:3000/${vip.photo_path.replace(/\\/g, "/")}`}
                    alt={vip.name}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "12px" }}>
                    <p style={{ color: "#E8DFD2", fontSize: "13px", fontWeight: 500, margin: "0 0 8px" }}>
                      {vip.name}
                    </p>
                    <button onClick={() => handleDelete(vip.id)}
                      style={{ background: "transparent", color: "#e06c6c", border: "0.5px solid #e06c6c55", borderRadius: "6px", padding: "5px 12px", fontSize: "11px", cursor: "pointer", width: "100%" }}>
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate(`/upload-vip/${orderId}`)}
              style={{ marginTop: "24px", background: "#2E4057", color: "#E8DFD2", border: "0.5px solid #C6A75E55", borderRadius: "8px", padding: "10px 24px", fontSize: "13px", cursor: "pointer" }}>
              + Tambah VIP
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VipListPage