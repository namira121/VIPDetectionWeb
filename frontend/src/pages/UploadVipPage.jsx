import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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

  const addEntry = () => {
    setEntries([...entries, { name: "", file: null, preview: null }])
  }

  const removeEntry = (index) => {
    if (entries.length === 1) return
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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
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

  return (
    <div style={{ background: "#0F1C2E", minHeight: "100vh", padding: "40px", display: "flex", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>

        <h2 style={{ color: "#E8DFD2", fontSize: "20px", fontWeight: 500, margin: "0 0 8px" }}>
          Upload Foto Tamu VIP
        </h2>
        <p style={{ color: "#9baab8", fontSize: "13px", margin: "0 0 32px" }}>
          Upload foto wajah untuk setiap tamu VIP yang akan dideteksi
        </p>

        {entries.map((entry, index) => (
          <div key={index} style={{
            background: "#1a2d42", border: "0.5px solid #2E4057",
            borderRadius: "12px", padding: "20px 24px", marginBottom: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ color: "#C6A75E", fontSize: "13px", fontWeight: 500 }}>
                Tamu VIP #{index + 1}
              </span>
              {entries.length > 1 && (
                <button onClick={() => removeEntry(index)}
                  style={{ background: "transparent", color: "#e06c6c", border: "none", cursor: "pointer", fontSize: "13px" }}>
                  Hapus
                </button>
              )}
            </div>

            {/* Nama */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ color: "#E8DFD2", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Nama Tamu VIP
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={entry.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                style={{
                  width: "100%", background: "#0F1C2E", border: "0.5px solid #2E4057",
                  borderRadius: "8px", padding: "10px 14px", color: "#E8DFD2",
                  fontSize: "13px", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Upload Foto */}
            <label style={{ color: "#E8DFD2", fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Foto Wajah
            </label>

            {entry.preview ? (
              <div>
                <img src={entry.preview} alt="preview"
                  style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                <label htmlFor={`file-${index}`}
                  style={{ display: "block", textAlign: "center", color: "#9baab8", fontSize: "12px", cursor: "pointer" }}>
                  Ganti foto
                </label>
              </div>
            ) : (
              <label htmlFor={`file-${index}`}
                style={{ display: "block", border: "1.5px dashed #2E4057", borderRadius: "10px", padding: "24px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📷</div>
                <p style={{ color: "#9baab8", fontSize: "13px", margin: 0 }}>Klik untuk upload foto wajah</p>
                <p style={{ color: "#5a6a7a", fontSize: "11px", margin: "4px 0 0" }}>JPG, PNG — maks. 2MB</p>
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

        {/* Tombol Tambah */}
        <button onClick={addEntry}
          style={{
            width: "100%", background: "transparent", color: "#C6A75E",
            border: "1px dashed #C6A75E55", borderRadius: "8px",
            padding: "12px", fontSize: "13px", cursor: "pointer", marginBottom: "24px"
          }}>
          + Tambah Tamu VIP
        </button>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: "100%", background: "#C6A75E", color: "#0F1C2E",
            border: "none", borderRadius: "8px", padding: "13px",
            fontSize: "14px", fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1, marginBottom: "10px"
          }}>
          {loading ? "Mengupload..." : "Simpan Foto VIP"}
        </button>

        <button onClick={() => navigate("/my-orders")}
          style={{
            width: "100%", background: "transparent", color: "#9baab8",
            border: "0.5px solid #2E4057", borderRadius: "8px",
            padding: "11px", fontSize: "13px", cursor: "pointer"
          }}>
          Kembali
        </button>

      </div>
    </div>
  )
}

export default UploadVipPage