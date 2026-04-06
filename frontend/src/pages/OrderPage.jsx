import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./css/OrderPage.css"

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

  // ===============================
  // Ambil daftar paket
  // ===============================
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

  // ===============================
  // Submit Order
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi jam
    if (startTime >= endTime) {
      alert("Jam selesai harus lebih dari jam mulai")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Silakan login terlebih dahulu")
      navigate("/login")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "http://localhost:3000/orders",
        {
          package_id: Number(packageId),
          event_name: eventName.trim(),
          event_date: eventDate,
          event_start_time: startTime + ":00",
          event_end_time: endTime + ":00",
          location: location.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Order berhasil dibuat")
      navigate("/customer")

    } catch (err) {
      console.log("ORDER ERROR:", err.response?.data || err.message)

      alert(
        err.response?.data?.message ||
        "Gagal membuat order, cek kembali data Anda"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="order-container">
      <div className="order-card">
        <h2>Book Your Event</h2>
        <p>Isi detail acara Anda untuk memesan paket VIP Detection</p>

        <form onSubmit={handleSubmit} className="order-form">

          {/* PILIH PAKET */}
          <div className="input-field">
            <label>Pilih Paket</label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              required
            >
              <option value="">Pilih Paket Layanan</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - Rp {Number(pkg.price).toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          {/* NAMA EVENT */}
          <div className="input-field">
            <label>Nama Event</label>
            <input
              type="text"
              placeholder="Contoh: Wedding of Budi & Ani"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          {/* TANGGAL */}
          <div className="input-field">
            <label>Tanggal Acara</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          {/* JAM */}
          <div className="time-group">
            <div className="input-field">
              <label>Jam Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <label>Jam Selesai</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* LOKASI */}
          <div className="input-field">
            <label>Lokasi Acara</label>
            <input
              type="text"
              placeholder="Nama Gedung / Alamat Lengkap"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="submit-order-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "CONFIRM ORDER"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  )
}

export default OrderPage