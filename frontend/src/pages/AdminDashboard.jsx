import { useNavigate } from "react-router-dom"
import "./css/AdminDashboard.css"

function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2 className="logo">VIP Admin</h2>

        <div className="sidebar-menu">
          <p onClick={() => navigate("/admin")}>Dashboard</p>
          <p onClick={() => navigate("/admin/orders")}>Orders</p>
          <p onClick={() => navigate("/admin/customers")}>Customers</p>
          <p onClick={() => navigate("/admin/vip-guests")}>VIP Guests</p>
          <p onClick={() => navigate("/admin/reports")}>Reports</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">

        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>24</p>
          </div>

          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>12</p>
          </div>

          <div className="stat-card">
            <h3>VIP Guests</h3>
            <p>87</p>
          </div>

          <div className="stat-card">
            <h3>Revenue</h3>
            <p>Rp 24.000.000</p>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="recent-section">
          <h2>Recent Orders</h2>

          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Package</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Andi</td>
                <td>Pro</td>
                <td>12 Feb 2026</td>
                <td>Active</td>
              </tr>

              <tr>
                <td>Sinta</td>
                <td>Premium</td>
                <td>15 Feb 2026</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard