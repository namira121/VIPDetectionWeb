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
      let res

      if (email === "admin@vip.com") {
        res = await axios.post(
          "http://localhost:3000/auth/admin/login",
          { email, password }
        )
        localStorage.setItem("token", res.data.token)
        navigate("/admin")
      } else {
        res = await axios.post(
          "http://localhost:3000/auth/customer/login",
          { email, password }
        )
        localStorage.setItem("token", res.data.token)
        navigate("/customer")
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login gagal")
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
