import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./css/CustomerDashboard.css" // Pastikan buat file CSS ini

function CustomerDashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("Customer")

  useEffect(() => {
    // Ambil nama dari localStorage jika ada saat login
    const storedName = localStorage.getItem("name")
    if (storedName) setUserName(storedName)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")  // ← ganti dari "/login" ke "/"
  }

  return (
    <div className="dashboard-wrapper">
      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <h2 className="logo">VIP Detection</h2>
          <div className="nav-menu">
            <Link to="/customer" className="active">Dashboard</Link>
            <Link to="/order">New Order</Link>
            <Link to="/my-orders">My History</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="welcome-header">
          <h1>Welcome Back, <span className="gold-text">{userName}</span></h1>
          <p>Manage your VIP detection events with elegance and precision.</p>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Active Orders</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Total VIPs</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Next Event</h3>
            <p className="stat-label">No upcoming events</p>
          </div>
        </section>

        <section className="action-section">
          <div className="action-card">
            <h2>Ready to host an event?</h2>
            <p>Choose from our exclusive packages and ensure your VIP guests feel recognized.</p>
            <Link to="/order">
              <button className="gold-btn">Create New Order</button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CustomerDashboard