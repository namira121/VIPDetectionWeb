import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const steps = [
  {
    num: 1,
    label: "Buat New Order",
    desc: "Pilih paket & jadwal event",
    detail: {
      title: "Langkah 1 — Buat New Order",
      body: `Pilih menu New Order di navigasi atas. Tentukan paket layanan (Basic, Pro, atau Premium), masukkan nama event, tanggal & waktu pelaksanaan, serta jumlah tamu VIP yang akan dideteksi. Setelah semua terisi, klik konfirmasi untuk membuat order.`,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
        <path d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    num: 2,
    label: "Bayar & Kirim Bukti",
    desc: "Transfer & upload bukti bayar",
    detail: {
      title: "Langkah 2 — Bayar & Kirim Bukti Pembayaran",
      body: `Lakukan transfer ke rekening yang tertera pada halaman order. Setelah transfer selesai, upload foto atau screenshot bukti pembayaran melalui tombol Upload Bukti Bayar di detail order kamu. Pastikan nominal dan nama rekening terlihat jelas.`,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    num: 3,
    label: "Tunggu Approval",
    desc: "Admin verifikasi pembayaran",
    detail: {
      title: "Langkah 3 — Tunggu Admin Approve Pembayaran",
      body: `Tim admin kami akan memverifikasi bukti pembayaran yang kamu kirim. Proses verifikasi biasanya memakan waktu 1x24 jam. Setelah disetujui, status order akan berubah menjadi Approved dan kamu bisa mulai upload foto tamu VIP.`,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    num: 4,
    label: "Download APK",
    desc: "Install VIP Detection App",
    detail: {
      title: "Langkah 4 — Download APK VIP Detection",
      body: `Unduh aplikasi VIP Detection untuk Android melalui link yang tersedia di halaman detail order. Install aplikasi tersebut di perangkat yang akan digunakan oleh petugas kamera di venue event kamu.`,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: 5,
    label: "Scan Barcode",
    desc: "Scan QR order di event",
    detail: {
      title: "Langkah 5 — Scan Barcode Order di Event",
      body: `Saat hari H event, buka aplikasi VIP Detection dan pilih menu Scan. Scan QR Code order yang bisa kamu temukan di halaman detail order — cetak atau tampilkan di layar. Sistem akan langsung memuat data wajah VIP dan siap mendeteksi tamu.`,
    },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><line x1="14" y1="14" x2="14" y2="14" />
        <line x1="17" y1="14" x2="21" y2="14" /><line x1="14" y1="17" x2="14" y2="21" />
        <line x1="17" y1="17" x2="17" y2="17" /><line x1="21" y1="17" x2="21" y2="21" />
        <line x1="17" y1="21" x2="21" y2="21" />
      </svg>
    ),
  },
]

function CustomerDashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("Customer")
  const [activeStep, setActiveStep] = useState(0)
  const [stats, setStats] = useState({ activeOrders: 0, totalVips: 0, nextEvent: null })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const storedName = localStorage.getItem("name")
    if (storedName) setUserName(storedName)

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/orders/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        console.log("STATS:", data)
        setStats(data)
      } catch (err) {
        console.error("Gagal fetch stats:", err)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const nextEventLabel = stats.nextEvent
    ? stats.nextEvent.event_name
    : "No upcoming events"

  const nextEventSub = stats.nextEvent
    ? new Date(stats.nextEvent.event_date).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
      })
    : "Create an order to schedule"

  return (
    <div style={styles.root}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>VIP Detection</span>
        <div style={styles.navLinks}>
          <Link to="/customer" style={{ ...styles.navLink, color: "#C6A75E" }}>Dashboard</Link>
          <Link to="/order" style={styles.navLink}>New Order</Link>
          <Link to="/my-orders" style={styles.navLink}>My History</Link>
          <button onClick={handleLogout} style={styles.navBtn}>Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <p style={styles.eyebrow}>Customer Portal</p>
        <h1 style={styles.heroTitle}>
          Welcome Back, <span style={{ color: "#C6A75E" }}>{userName}</span>
        </h1>
        <p style={styles.heroSub}>Manage your VIP detection events with elegance and precision.</p>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        {/* Active Orders */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p style={styles.statLabel}>Active Orders</p>
          <p style={styles.statVal}>{loadingStats ? "..." : stats.activeOrders}</p>
          <p style={styles.statSub}>No active orders yet</p>
        </div>

        {/* Total VIPs */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p style={styles.statLabel}>Total VIPs</p>
          <p style={styles.statVal}>{loadingStats ? "..." : stats.totalVips}</p>
          <p style={styles.statSub}>Registered VIP guests</p>
        </div>

        {/* Next Event */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p style={styles.statLabel}>Next Event</p>
          <p style={{
            ...styles.statVal,
            fontSize: loadingStats || !stats.nextEvent ? "16px" : "20px",
            marginTop: "8px",
            color: stats.nextEvent ? "#F5F2EC" : "rgba(232,223,210,0.45)"
          }}>
            {loadingStats ? "..." : nextEventLabel}
          </p>
          <p style={styles.statSub}>{loadingStats ? "" : nextEventSub}</p>
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={styles.ctaBanner}>
        <div>
          <h3 style={styles.ctaTitle}>Ready to host an event?</h3>
          <p style={styles.ctaDesc}>
            Choose from our exclusive packages and ensure your VIP guests feel recognized at every moment.
          </p>
        </div>
        <Link to="/order">
          <button style={styles.ctaBtn}>Create New Order</button>
        </Link>
      </div>

      {/* DIVIDER */}
      <div style={styles.divider} />

      {/* HOW TO ORDER */}
      <div style={styles.sectionHeader}>
        <p style={styles.sectionEyebrow}>Panduan Pemesanan</p>
        <h2 style={styles.sectionTitle}>Cara Menggunakan Layanan</h2>
      </div>

      <div style={styles.stepsContainer}>
        <div style={styles.stepsGrid}>
          <div style={styles.connector} />
          {steps.map((step, i) => (
            <div key={i} style={styles.stepItem} onClick={() => setActiveStep(i)}>
              <div style={{ ...styles.stepCircle, ...(activeStep === i ? styles.stepCircleActive : {}) }}>
                <span style={styles.stepNum}>{step.num}</span>
                {step.icon}
              </div>
              <p style={styles.stepLabel}>{step.label}</p>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.stepDetail}>
          <h4 style={styles.stepDetailTitle}>{steps[activeStep].detail.title}</h4>
          <p style={styles.stepDetailBody}>{steps[activeStep].detail.body}</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#0F1C2E",
    minHeight: "100vh",
    color: "#E8DFD2",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.1rem 2.5rem",
    borderBottom: "0.5px solid rgba(198,167,94,0.2)",
    background: "rgba(15,28,46,0.97)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navLogo: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "20px",
    fontWeight: "600",
    color: "#C6A75E",
    letterSpacing: "0.02em",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  navLink: {
    fontSize: "12px",
    fontWeight: "400",
    color: "rgba(232,223,210,0.6)",
    textDecoration: "none",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  navBtn: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#C6A75E",
    border: "0.5px solid #C6A75E",
    background: "transparent",
    padding: "6px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  hero: {
    padding: "3.5rem 2.5rem 2rem",
    position: "relative",
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    top: "-60px",
    right: "-80px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    border: "0.5px solid rgba(198,167,94,0.08)",
    pointerEvents: "none",
  },
  heroCircle2: {
    position: "absolute",
    top: "-20px",
    right: "-40px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    border: "0.5px solid rgba(198,167,94,0.12)",
    pointerEvents: "none",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#C6A75E",
    marginBottom: "0.5rem",
    fontWeight: "500",
  },
  heroTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "42px",
    fontWeight: "500",
    color: "#F5F2EC",
    lineHeight: "1.15",
    margin: "0 0 0.5rem",
  },
  heroSub: {
    fontSize: "14px",
    color: "rgba(232,223,210,0.5)",
    fontWeight: "300",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    padding: "0 2.5rem 2rem",
  },
  statCard: {
    background: "rgba(232,223,210,0.04)",
    border: "0.5px solid rgba(198,167,94,0.18)",
    borderRadius: "12px",
    padding: "1.5rem",
    position: "relative",
  },
  statIcon: {
    position: "absolute",
    right: "1.2rem",
    top: "1.2rem",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(198,167,94,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#C6A75E",
    fontWeight: "500",
    margin: "0 0 0.6rem",
  },
  statVal: {
    fontFamily: "Georgia, serif",
    fontSize: "38px",
    fontWeight: "500",
    color: "#F5F2EC",
    lineHeight: "1",
    margin: "0 0 0.4rem",
  },
  statSub: {
    fontSize: "12px",
    color: "rgba(232,223,210,0.35)",
    fontWeight: "300",
    margin: 0,
  },
  ctaBanner: {
    margin: "0 2.5rem 2.5rem",
    background: "linear-gradient(135deg, rgba(198,167,94,0.1) 0%, rgba(46,64,87,0.35) 100%)",
    border: "0.5px solid rgba(198,167,94,0.22)",
    borderRadius: "16px",
    padding: "2rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  ctaTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "22px",
    fontWeight: "500",
    color: "#F5F2EC",
    margin: "0 0 0.4rem",
  },
  ctaDesc: {
    fontSize: "13px",
    color: "rgba(232,223,210,0.5)",
    margin: 0,
    fontWeight: "300",
  },
  ctaBtn: {
    background: "#C6A75E",
    color: "#0F1C2E",
    border: "none",
    padding: "12px 28px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  divider: {
    height: "0.5px",
    background: "rgba(198,167,94,0.1)",
    margin: "0 2.5rem 2.5rem",
  },
  sectionHeader: {
    padding: "0 2.5rem",
    marginBottom: "1.5rem",
  },
  sectionEyebrow: {
    fontSize: "10px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#C6A75E",
    margin: "0 0 0.3rem",
  },
  sectionTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "26px",
    fontWeight: "500",
    color: "#F5F2EC",
    margin: 0,
  },
  stepsContainer: {
    padding: "0 2.5rem 3rem",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 0,
    position: "relative",
    marginBottom: "1.5rem",
  },
  connector: {
    position: "absolute",
    top: "27px",
    left: "calc(10% + 20px)",
    right: "calc(10% + 20px)",
    height: "0.5px",
    background: "linear-gradient(90deg, rgba(198,167,94,0.6), rgba(198,167,94,0.15), rgba(198,167,94,0.6))",
    zIndex: 0,
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0 0.5rem",
    position: "relative",
    zIndex: 1,
    cursor: "pointer",
  },
  stepCircle: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    border: "1px solid rgba(198,167,94,0.3)",
    background: "#0F1C2E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.9rem",
    position: "relative",
    transition: "all 0.2s",
  },
  stepCircleActive: {
    borderColor: "#C6A75E",
    background: "rgba(198,167,94,0.1)",
  },
  stepNum: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#C6A75E",
    color: "#0F1C2E",
    fontSize: "9px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#E8DFD2",
    lineHeight: "1.3",
    margin: "0 0 0.25rem",
  },
  stepDesc: {
    fontSize: "10px",
    color: "rgba(232,223,210,0.38)",
    fontWeight: "300",
    lineHeight: "1.4",
    margin: 0,
  },
  stepDetail: {
    background: "rgba(232,223,210,0.04)",
    border: "0.5px solid rgba(198,167,94,0.2)",
    borderRadius: "12px",
    padding: "1.5rem 2rem",
  },
  stepDetailTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "17px",
    fontWeight: "500",
    color: "#C6A75E",
    margin: "0 0 0.6rem",
  },
  stepDetailBody: {
    fontSize: "13px",
    color: "rgba(232,223,210,0.62)",
    margin: 0,
    fontWeight: "300",
    lineHeight: "1.7",
  },
}

export default CustomerDashboard