import { Link, useNavigate } from "react-router-dom"
import "./css/CustomerDashboard.css"

function CustomerDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="dashboard-container">

      <div className="navbar">
        <h2>VIP Detection</h2>

        <div className="nav-links">
          <Link to="/customer">Dashboard</Link>
          <Link to="/order">New Order</Link>
          <Link to="/my-orders">My Orders</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Welcome Back</h3>
          <p>Manage your VIP detection events with elegance.</p>
        </div>
      </div>

    </div>
  )
}

export default CustomerDashboard
