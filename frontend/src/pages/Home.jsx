import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./css/Home.css"

const images = [
  "/images/website_hero_1.jpg",
  "/images/website_hero_2.jpg",
  "/images/website_hero_3.jpg",
]

function Home() {
  const [current, setCurrent] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
  fetch("http://localhost:3000/packages")
    .then((res) => res.json())
    .then((data) => {
      console.log("PACKAGES:", data)
      setPackages(data)
    })
    .catch((err) => console.error("Gagal fetch packages:", err))
}, [])

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val)

  return (
    <div className="home-wrapper" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* BACKGROUND SLIDES */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`bg-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* NAVBAR */}
      <div className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <h2 className="logo" style={{ fontFamily: "Georgia, serif", color: "#C6A75E" }}>
            VIP Detection
          </h2>
          <div className="nav-links">
            <Link to="/login" style={{ color: "#E8DFD2", fontFamily: "'Segoe UI', sans-serif", fontSize: "13px", letterSpacing: "0.06em" }}>Login</Link>
            <Link to="/register" className="gold-outline" style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: "13px", letterSpacing: "0.06em" }}>
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C6A75E", marginBottom: "1rem", fontWeight: "500" }}>
          Exclusive Recognition Service
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "72px", color: "#C6A75E", margin: "0 0 1rem", lineHeight: "1.1" }}>
          VIP Detection
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(232,223,210,0.75)", margin: "0 0 2.5rem", fontWeight: "300", letterSpacing: "0.02em" }}>
          Exclusive Guest Recognition for Elegant Events
        </p>
        <Link to="/login">
          <button style={{ background: "#C6A75E", color: "#0F1C2E", padding: "14px 36px", borderRadius: "30px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Segoe UI', sans-serif" }}>
            Get Started
          </button>
        </Link>
        <div className="scroll-indicator" style={{ color: "rgba(232,223,210,0.5)", fontSize: "13px", marginTop: "80px" }}>
          Scroll ↓
        </div>
      </div>

      {/* PACKAGE SECTION */}
      <div className="packages-section">
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C6A75E", marginBottom: "0.5rem", fontWeight: "500" }}>
          Layanan Kami
        </p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "38px", color: "#F5F2EC", marginBottom: "60px", fontWeight: "500" }}>
          Our Packages
        </h2>

        <div className="package-grid">
          {packages.length === 0 ? (
            <p style={{ color: "rgba(232,223,210,0.4)", fontSize: "14px" }}>Memuat paket...</p>
          ) : (
            packages.map((pkg, i) => {
              const isFeatured = i === 1
              return (
                <div
                  key={pkg.id}
                  className={`package-card ${isFeatured ? "featured" : ""}`}
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <div className="card-header">
                    {isFeatured && <span className="badge">Most Popular</span>}
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "28px", marginBottom: "8px", color: "#0F1C2E" }}>
                      {pkg.name}
                    </h3>
                    <p className="price" style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#2E4057", fontWeight: "700" }}>
                      {formatRupiah(pkg.price)}
                    </p>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", textAlign: "left", flexGrow: 1 }}>
                    <li style={{ marginBottom: "12px", fontSize: "14px", paddingLeft: "24px", position: "relative", color: "#0F1C2E" }}>
                      <span style={{ position: "absolute", left: 0, color: "#C6A75E", fontWeight: "bold" }}>✓</span>
                      Aplikasi untuk deteksi
                    </li>
                    <li style={{ marginBottom: "12px", fontSize: "14px", paddingLeft: "24px", position: "relative", color: "#0F1C2E" }}>
                      <span style={{ position: "absolute", left: 0, color: "#C6A75E", fontWeight: "bold" }}>✓</span>
                      Jumlah VIP {pkg.max_vip} orang
                    </li>
                    <li style={{ marginBottom: "12px", fontSize: "14px", paddingLeft: "24px", position: "relative", color: "#0F1C2E" }}>
                      <span style={{ position: "absolute", left: 0, color: "#C6A75E", fontWeight: "bold" }}>✓</span>
                      Durasi {pkg.max_hours} jam
                    </li>
                  </ul>

                  <Link to="/login">
                    <button
                      className={`package-btn ${isFeatured ? "gold-fill" : ""}`}
                      style={{ fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em" }}
                    >
                      Choose {pkg.name}
                    </button>
                  </Link>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <h2 style={{ fontFamily: "Georgia, serif", color: "#C6A75E", fontSize: "22px" }}>VIP Detection</h2>
            <p style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: "14px", fontWeight: "300" }}>
              Sistem pengenalan tamu eksklusif untuk pernikahan mewah dan acara formal lainnya.
            </p>
          </div>
          <div className="footer-links">
            <h4 style={{ fontFamily: "Georgia, serif", color: "#C6A75E", fontSize: "16px", marginBottom: "16px" }}>Contact Us</h4>
            <p style={{ fontSize: "13px", fontWeight: "300" }}>Email: info@vipdetection.com</p>
            <p style={{ fontSize: "13px", fontWeight: "300" }}>Phone: +62 812 3456 7890</p>
            <p style={{ fontSize: "13px", fontWeight: "300" }}>Alamat: Yogyakarta, Indonesia</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: "12px" }}>
            &copy; 2026 VIP Detection. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home