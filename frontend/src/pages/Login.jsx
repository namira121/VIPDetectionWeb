import "./css/Login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      if (res.data.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/customer")
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login gagal")
    }
  }


  // ... (import tetap sama)

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <p>Access your dashboard with your credentials</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login