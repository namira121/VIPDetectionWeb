import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"

function UploadVipPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [entries, setEntries] = useState([{ name: "", file: null, preview: null }])
  const [loading, setLoading] = useState(false)

  const handleNameChange = (index, value) => {
    const updated = [...entries]
    updated[index].name = value
    setEntries(updated)
  }

  const handleFileChange = (index, file) => {
    if (!file) return
    const updated = [...entries]
    updated[index].file = file
    updated[index].preview = URL.createObjectURL(file)
    setEntries(updated)
  }

  const addEntry = () => setEntries([...entries, { name: "", file: null, preview: null }])

  const removeEntry = (index) => {
    if (entries.length === 1) {
      setEntries([{ name: "", file: null, preview: null }])
      return
    }
    setEntries(entries.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const invalid = entries.find(e => !e.name.trim() || !e.file)
    if (invalid) return alert("Lengkapi nama dan foto untuk semua tamu VIP")
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      for (const entry of entries) {
        const formData = new FormData()
        formData.append("order_id", orderId)
        formData.append("name", entry.name.trim())
        formData.append("photo", entry.file)
        await axios.post("http://localhost:3000/vip/upload", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        })
      }
      alert("Foto VIP berhasil diupload!")
      navigate("/my-orders")
    } catch (err) {
      alert(err.response?.data?.message || "Gagal upload foto VIP")
    } finally {
      setLoading(false)
    }
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

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(232,223,210,0.06)",
    border: "0.5px solid rgba(198,167,94,0.25)",
    borderRadius: "8px",
    color: "#E8DFD2",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  }

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", position: "relative" }}>

      {/* NAVBAR */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", borderBottom: "0.5px solid rgba(198,167,94,0.2)", background: "rgba(15,28,46,0.97)", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#C6A75E" }}>VIP Detection</span>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/customer" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dashboard</Link>
          <Link to="/my-orders" style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>My History</Link>
        </div>
      </nav>

      <div style={{ padding: "2.5rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "560px" }}>

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
            <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.3rem", fontWeight: "500" }}>Upload</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 0.3rem" }}>Foto Tamu VIP</h1>
            <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>
              Upload foto wajah untuk setiap tamu VIP yang akan dideteksi
            </p>
          </div>

          {/* ENTRY LIST */}
          {entries.map((entry, index) => (
            <div key={index} style={{
              background: "rgba(232,223,210,0.03)",
              border: "0.5px solid rgba(198,167,94,0.18)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1rem",
              position: "relative",
            }}>
              {/* Garis emas atas */}
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C6A75E", fontWeight: "500" }}>
                  Tamu VIP #{index + 1}
                </span>
                {(
                    <button onClick={() => removeEntry(index)}
                    style={{ background: "transparent", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "12px", fontFamily: "'Segoe UI', sans-serif" }}>
                    Hapus
                  </button>
                )}
              </div>

              {/* Nama */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>Nama Tamu VIP</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={entry.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Foto */}
              <label style={labelStyle}>Foto Wajah</label>
              {entry.preview ? (
                <div>
                  <img src={entry.preview} alt="preview"
                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                  <label htmlFor={`file-${index}`}
                    style={{ display: "block", textAlign: "center", color: "#C6A75E", fontSize: "12px", cursor: "pointer", letterSpacing: "0.06em" }}>
                    Ganti foto
                  </label>
                </div>
              ) : (
                <label htmlFor={`file-${index}`}
                  style={{ display: "block", border: "1px dashed rgba(198,167,94,0.3)", borderRadius: "10px", padding: "28px 24px", textAlign: "center", cursor: "pointer", background: "rgba(198,167,94,0.03)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(198,167,94,0.5)" strokeWidth="1.5" style={{ marginBottom: "10px" }}>
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <p style={{ color: "rgba(232,223,210,0.55)", fontSize: "13px", margin: "0 0 4px" }}>Klik untuk upload foto wajah</p>
                  <p style={{ color: "rgba(232,223,210,0.3)", fontSize: "11px", margin: 0 }}>JPG, PNG — maks. 2MB</p>
                </label>
              )}

              <input
                id={`file-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          ))}

          {/* Tambah Tamu */}
          <button onClick={addEntry}
            style={{
              width: "100%", background: "transparent", color: "#C6A75E",
              border: "1px dashed rgba(198,167,94,0.35)", borderRadius: "8px",
              padding: "12px", fontSize: "13px", cursor: "pointer",
              marginBottom: "1.5rem", fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: "0.04em",
            }}>
            + Tambah Tamu VIP
          </button>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%", background: loading ? "rgba(198,167,94,0.5)" : "#C6A75E",
              color: "#0F1C2E", border: "none", borderRadius: "8px",
              padding: "13px", fontSize: "12px", fontWeight: "600",
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Segoe UI', sans-serif", marginBottom: "0.8rem",
            }}>
            {loading ? "Mengupload..." : "Simpan Foto VIP"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default UploadVipPage