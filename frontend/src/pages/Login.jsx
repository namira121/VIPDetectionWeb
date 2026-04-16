import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("name", res.data.name || res.data.customer?.name || "")
      console.log("LOGIN RESPONSE:", res.data)
      if (res.data.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/customer")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F1C2E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
    }}>

      {/* Dekoratif lingkaran */}
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.08)", pointerEvents: "none" }} />

      {/* PANAH BALIK */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(232,223,210,0.5)",
          textDecoration: "none",
          fontSize: "12px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#C6A75E"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(232,223,210,0.5)"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" />
        </svg>
        Kembali
      </Link>

      {/* CARD */}
      <div style={{
        background: "rgba(232,223,210,0.04)",
        border: "0.5px solid rgba(198,167,94,0.22)",
        borderRadius: "16px",
        padding: "2.5rem 2.5rem",
        width: "100%",
        maxWidth: "380px",
        position: "relative",
      }}>
        {/* Garis emas atas */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, #C6A75E, transparent)" }} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C6A75E", margin: "0 0 0.5rem", fontWeight: "500" }}>
            Customer Portal
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: "500", color: "#F5F2EC", margin: "0 0 0.4rem" }}>
            Sign In
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>
            Access your dashboard with your credentials
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(232,223,210,0.06)",
                border: "0.5px solid rgba(198,167,94,0.25)",
                borderRadius: "8px",
                color: "#E8DFD2",
                fontSize: "14px",
                fontFamily: "'Segoe UI', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(232,223,210,0.06)",
                border: "0.5px solid rgba(198,167,94,0.25)",
                borderRadius: "8px",
                color: "#E8DFD2",
                fontSize: "14px",
                fontFamily: "'Segoe UI', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              background: "#C6A75E",
              color: "#0F1C2E",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "1.2rem", fontSize: "13px", color: "rgba(232,223,210,0.4)", textAlign: "center", fontWeight: "300" }}>
          Belum punya akun?{" "}
          <Link
            to="/register"
            style={{ color: "#C6A75E", fontWeight: "500", textDecoration: "none", borderBottom: "0.5px solid rgba(198,167,94,0.4)", paddingBottom: "1px" }}
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login