import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama"
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
