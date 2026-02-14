import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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

  // Ambil daftar paket saat halaman dibuka
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/packages")
        setPackages(res.data)
      } catch (err) {
        console.log("Gagal ambil paket")
      }
    }

    fetchPackages()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:3000/orders",
        {
          package_id: packageId,
          event_name: eventName,
          event_date: eventDate,
          event_start_time: startTime,
          event_end_time: endTime,
          location: location,
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
      console.log(err.response?.data)
      alert("Gagal membuat order")
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Buat Order</h2>

      <form onSubmit={handleSubmit}>

        <select
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          required
        >
          <option value="">Pilih Paket</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - Rp {pkg.price}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Nama Event"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Lokasi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Submit Order</button>
      </form>
    </div>
  )
}

export default OrderPage
