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
          <div className="package-card">
            <h3>Basic</h3>
            <p>Up to 10 VIP Guests</p>
            <p className="price">Rp 1.500.000</p>
          </div>

          <div className="package-card premium">
            <h3>Pro</h3>
            <p>Up to 30 VIP Guests</p>
            <p className="price">Rp 3.000.000</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
