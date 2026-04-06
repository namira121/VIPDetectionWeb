import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CustomerDashboard from "./pages/CustomerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import OrderPage from "./pages/OrderPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import PaymentPage from "./pages/PaymentPage"  
import AdminOrdersPage from "./pages/AdminOrdersPage"
import UploadVipPage from "./pages/UploadVipPage"
import VipListPage from "./pages/VipListPage"
import BarcodePage from "./pages/BarcodePage"
import AdminCustomersPage from "./pages/AdminCustomersPage"
import AdminVipGuestsPage from "./pages/AdminVipGuestsPage"
import AdminReportsPage from "./pages/AdminReportsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} /> 
        <Route path="/upload-vip/:orderId" element={<UploadVipPage />} />
        <Route path="/vip-list/:orderId" element={<VipListPage />} />
        <Route path="/barcode/:orderId" element={<BarcodePage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/vip-guests" element={<AdminVipGuestsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
