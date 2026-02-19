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

  // AUTO SLIDESHOW
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // NAVBAR SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="home-wrapper">

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
          <h2 className="logo">VIP Detection</h2>

          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register" className="gold-outline">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>VIP Detection</h1>
        <p>Exclusive Guest Recognition for Elegant Weddings</p>

        <Link to="/login">
          <button className="gold-btn">Get Started</button>
        </Link>

        <div className="scroll-indicator">Scroll ↓</div>
      </div>

      {/* PACKAGE SECTION */}
      <div className="packages-section">
        <h2>Our Packages</h2>

        <div className="package-grid">

          {/* BASIC */}
          <div className="package-card">
            <h3>Basic</h3>
            <p className="price">Rp 1.500.000</p>

            <ul>
              <li>Alat-alat deteksi</li>
              <li>Aplikasi untuk deteksi</li>
              <li>Jumlah VIP 10–20 orang</li>
              <li>Durasi 3–4 jam</li>
            </ul>

            <button className="package-btn">Choose Basic</button>
          </div>

          {/* PRO */}
          <div className="package-card pro">
            <h3>Pro</h3>
            <p className="price">Rp 3.000.000</p>

            <ul>
              <li>Alat-alat deteksi</li>
              <li>Aplikasi untuk deteksi</li>
              <li>Jumlah VIP 30–50 orang</li>
              <li>Durasi 5–8 jam</li>
            </ul>

            <button className="package-btn">Choose Pro</button>
          </div>

          {/* PREMIUM */}
          <div className="package-card premium">
            <h3>Premium</h3>
            <p className="price">Rp 4.500.000</p>

            <ul>
              <li>Alat-alat deteksi</li>
              <li>Aplikasi untuk deteksi</li>
              <li>Jumlah VIP 60–100 orang</li>
              <li>Durasi 9–12 jam</li>
            </ul>

            <button className="package-btn gold-btn">Choose Premium</button>
          </div>

        </div>
      </div>


    </div>
  )
}

export default Home
