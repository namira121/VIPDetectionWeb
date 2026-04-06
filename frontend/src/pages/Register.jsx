import { useState } from "react"
import { useNavigate, Link } from "react-router-dom" // Tambah Link untuk navigasi balik
import axios from "axios"
import "./css/Auth.css" // Kita gunakan satu file CSS untuk Login & Register

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:3000/auth/customer/register",
        { name, email, password }
      )
      alert("Register berhasil")
      navigate("/login")
    } catch (err) {
      alert("Register gagal")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Daftar sekarang untuk mulai berbelanja</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nama Lengkap"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            REGISTER
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </div>
      </div>
    </div>
  )
}

export default Register