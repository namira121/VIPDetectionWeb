import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function OrderPage() {
  const navigate = useNavigate()

  const [packages, setPackages] = useState([])
  const [packageId, setPackageId] = useState("")
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const selectedPackage = packages.find((p) => String(p.id) === String(packageId))

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/packages")
        setPackages(res.data)
      } catch (err) {
        console.log("Gagal ambil paket:", err.response?.data || err.message)
      }
    }
    fetchPackages()
  }, [])

  const validate = () => {
    const newErrors = {}

    if (!packageId) newErrors.packageId = "Paket harus dipilih"

    if (!eventName.trim()) {
      newErrors.eventName = "Nama event tidak boleh kosong"
    } else if (eventName.length > 150) {
      newErrors.eventName = "Nama event maksimal 150 karakter"
    } else if (/[<>{}[\]\\|]/.test(eventName)) {
      newErrors.eventName = "Nama event mengandung karakter tidak valid"
    }

    if (!eventDate) newErrors.eventDate = "Tanggal acara harus diisi"
    else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (new Date(eventDate) < today) newErrors.eventDate = "Tanggal tidak boleh di masa lalu"
    }

    if (!startTime) newErrors.startTime = "Jam mulai harus diisi"
    if (!endTime) newErrors.endTime = "Jam selesai harus diisi"
    if (startTime && endTime && startTime >= endTime)
      newErrors.endTime = "Jam selesai harus lebih dari jam mulai"

    if (!location.trim()) {
      newErrors.location = "Lokasi tidak boleh kosong"
    } else if (location.length < 10) {
      newErrors.location = "Lokasi minimal 10 karakter"
    } else if (location.length > 255) {
      newErrors.location = "Lokasi maksimal 255 karakter"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Silakan login terlebih dahulu")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      await axios.post(
        "http://localhost:3000/orders",
        {
          package_id: Number(packageId),
          event_name: eventName.trim(),
          event_date: eventDate,
          event_start_time: startTime + ":00",
          event_end_time: endTime + ":00",
          location: location.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Order berhasil dibuat")
      navigate("/customer")
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat order, cek kembali data Anda")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "11px 14px",
    background: "rgba(232,223,210,0.06)",
    border: `0.5px solid ${hasError ? "rgba(248,113,113,0.6)" : "rgba(198,167,94,0.25)"}`,
    borderRadius: "8px",
    color: "#E8DFD2",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  })

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#C6A75E",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block",
  }

  const errorStyle = {
    fontSize: "11px",
    color: "#f87171",
    marginTop: "4px",
    marginBottom: 0,
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <>
    <style>{`
      input[type="date"],
      input[type="time"] {
        color-scheme: dark;
      }
      select option {
        background: #1a2d45;
        color: #E8DFD2;
      }
    `}</style>
    <div style={{
      minHeight: "100vh",
      background: "#0F1C2E",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "3rem 1rem",
      position: "relative",
    }}>

      {/* Dekoratif */}
      <div style={{ position: "fixed", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.08)", pointerEvents: "none" }} />

      {/* PANAH BALIK */}
      <Link
        to="/customer"
        style={{ position: "fixed", top: "24px", left: "24px", display: "flex", alignItems: "center", gap: "8px", color: "rgba(232,223,210,0.5)", textDecoration: "none", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#C6A75E"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,223,210,0.5)"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" />
        </svg>
        Kembali
      </Link>

      {/* CARD */}
      <div style={{
        background: "rgba(232,223,210,0.04)",
        border: "0.5px solid rgba(198,167,94,0.22)",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "560px",
        position: "relative",
      }}>
        {/* Garis emas atas */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, #C6A75E, transparent)" }} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.5rem", fontWeight: "500" }}>
            New Order
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 0.4rem" }}>
            Book Your Event
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>
            Isi detail acara Anda untuk memesan paket VIP Detection
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* PILIH PAKET */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Pilih Paket</label>
            <select
              value={packageId}
              onChange={(e) => { setPackageId(e.target.value); setErrors((p) => ({ ...p, packageId: "" })) }}
              style={{ ...inputStyle(errors.packageId), appearance: "auto" }}
            >
              <option value="">Pilih Paket Layanan</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — Rp {Number(pkg.price).toLocaleString("id-ID")} | Max {pkg.max_vip} VIP | {pkg.max_hours} jam
                </option>
              ))}
            </select>
            {errors.packageId && <p style={errorStyle}>{errors.packageId}</p>}

            {/* Info paket terpilih */}
            {selectedPackage && (
              <div style={{ marginTop: "8px", padding: "10px 14px", background: "rgba(198,167,94,0.08)", border: "0.5px solid rgba(198,167,94,0.2)", borderRadius: "8px", display: "flex", gap: "1.5rem" }}>
                <span style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)" }}>
                  Max VIP: <strong style={{ color: "#C6A75E" }}>{selectedPackage.max_vip} orang</strong>
                </span>
                <span style={{ fontSize: "12px", color: "rgba(232,223,210,0.6)" }}>
                  Durasi: <strong style={{ color: "#C6A75E" }}>{selectedPackage.max_hours} jam</strong>
                </span>
              </div>
            )}
          </div>

          {/* NAMA EVENT */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Nama Event</label>
            <input
              type="text"
              placeholder="Contoh: Wedding of Budi & Ani"
              value={eventName}
              maxLength={150}
              onChange={(e) => { setEventName(e.target.value); setErrors((p) => ({ ...p, eventName: "" })) }}
              required
              style={inputStyle(errors.eventName)}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {errors.eventName ? <p style={errorStyle}>{errors.eventName}</p> : <span />}
              <p style={{ fontSize: "11px", color: "rgba(232,223,210,0.25)", margin: "4px 0 0" }}>{eventName.length}/150</p>
            </div>
          </div>

          {/* TANGGAL */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Tanggal Acara</label>
            <input
              type="date"
              value={eventDate}
              min={today}
              onChange={(e) => { setEventDate(e.target.value); setErrors((p) => ({ ...p, eventDate: "" })) }}
              required
              style={inputStyle(errors.eventDate)}
            />
            {errors.eventDate && <p style={errorStyle}>{errors.eventDate}</p>}
          </div>

          {/* JAM */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
            <div>
              <label style={labelStyle}>Jam Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); setErrors((p) => ({ ...p, startTime: "" })) }}
                required
                style={inputStyle(errors.startTime)}
              />
              {errors.startTime && <p style={errorStyle}>{errors.startTime}</p>}
            </div>
            <div>
              <label style={labelStyle}>Jam Selesai</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => { setEndTime(e.target.value); setErrors((p) => ({ ...p, endTime: "" })) }}
                required
                style={inputStyle(errors.endTime)}
              />
              {errors.endTime && <p style={errorStyle}>{errors.endTime}</p>}
            </div>
          </div>

          {/* LOKASI */}
          <div style={{ marginBottom: "1.8rem" }}>
            <label style={labelStyle}>Lokasi Acara</label>
            <textarea
              placeholder="Nama Gedung / Alamat Lengkap (minimal 10 karakter)"
              value={location}
              maxLength={255}
              rows={3}
              onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: "" })) }}
              required
              style={{ ...inputStyle(errors.location), resize: "vertical", minHeight: "80px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {errors.location ? <p style={errorStyle}>{errors.location}</p> : <span />}
              <p style={{ fontSize: "11px", color: "rgba(232,223,210,0.25)", margin: "4px 0 0" }}>{location.length}/255</p>
            </div>
          </div>

          {/* TOMBOL */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading ? "rgba(198,167,94,0.5)" : "#C6A75E",
              color: "#0F1C2E",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "0.8rem",
            }}
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/customer")}
            style={{
              width: "100%",
              padding: "11px",
              background: "transparent",
              color: "rgba(232,223,210,0.4)",
              border: "0.5px solid rgba(232,223,210,0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default OrderPage