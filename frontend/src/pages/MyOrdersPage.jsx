import { useEffect, useState } from "react"
import axios from "axios"

function MyOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get(
          "http://localhost:3000/orders/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setOrders(res.data)

      } catch (err) {
        console.log("Gagal ambil order")
      }
    }

    fetchOrders()
  }, [])

  return (
    <div style={{ padding: "40px" }}>
      <h2>Order Saya</h2>

      {orders.length === 0 ? (
        <p>Belum ada order</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px"
          }}>
            <p><b>Event:</b> {order.event_name}</p>
            <p><b>Tanggal:</b> {order.event_date}</p>
            <p><b>Status:</b> {order.status}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrdersPage
