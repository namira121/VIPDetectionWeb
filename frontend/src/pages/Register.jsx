import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Nama tidak boleh kosong"
    } else if (name.length > 100) {
      newErrors.name = "Nama maksimal 100 karakter"
    } else if (/[^a-zA-Z\s]/.test(name)) {
      newErrors.name = "Nama hanya boleh huruf dan spasi"
    }

    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid"
    } else if (email.length > 100) {
      newErrors.email = "Email maksimal 100 karakter"
    }

    if (!password) {
      newErrors.password = "Password tidak boleh kosong"
    } else if (password.length < 8 || password.length > 12) {
      newErrors.password = "Password harus 8–12 karakter"
    }

    return newErrors
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    try {
      await axios.post("http://localhost:3000/auth/customer/register", { name, email, password })
      alert("Register berhasil! Silakan login.")
      navigate("/login")
    } catch (err) {
      alert(err.response?.data?.message || "Register gagal")
    }
  }

  const inputStyle = {
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
  }

  const errorStyle = {
    fontSize: "11px",
    color: "#f87171",
    marginTop: "4px",
    marginBottom: 0,
    paddingLeft: "2px",
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

      {/* Dekoratif */}
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", border: "0.5px solid rgba(198,167,94,0.08)", pointerEvents: "none" }} />

      {/* PANAH BALIK */}
      <Link
        to="/"
        style={{ position: "fixed", top: "24px", left: "24px", display: "flex", alignItems: "center", gap: "8px", color: "rgba(232,223,210,0.5)", textDecoration: "none", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}
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
        padding: "2.5rem",
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
            Create Account
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(232,223,210,0.45)", margin: 0, fontWeight: "300" }}>
            Daftar sekarang untuk mulai menggunakan layanan
          </p>
        </div>

        <form onSubmit={handleRegister}>
          {/* NAMA */}
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              maxLength={100}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
              }}
              required
              style={{ ...inputStyle, borderColor: errors.name ? "rgba(248,113,113,0.5)" : "rgba(198,167,94,0.25)" }}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
              }}
              required
              style={{ ...inputStyle, borderColor: errors.email ? "rgba(248,113,113,0.5)" : "rgba(198,167,94,0.25)" }}
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="password"
              placeholder="Password (8–12 karakter)"
              value={password}
              maxLength={12}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
              }}
              required
              style={{ ...inputStyle, borderColor: errors.password ? "rgba(248,113,113,0.5)" : "rgba(198,167,94,0.25)" }}
            />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
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
            Register
          </button>
        </form>

        <p style={{ marginTop: "1.2rem", fontSize: "13px", color: "rgba(232,223,210,0.4)", textAlign: "center", fontWeight: "300" }}>
          Sudah punya akun?{" "}
          <Link
            to="/login"
            style={{ color: "#C6A75E", fontWeight: "500", textDecoration: "none", borderBottom: "0.5px solid rgba(198,167,94,0.4)", paddingBottom: "1px" }}
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register