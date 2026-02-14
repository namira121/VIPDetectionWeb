import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CustomerDashboard from "./pages/CustomerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import OrderPage from "./pages/OrderPage"
import MyOrdersPage from "./pages/MyOrdersPage"


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
      </Routes>
    </BrowserRouter>
  )
}

export default App
