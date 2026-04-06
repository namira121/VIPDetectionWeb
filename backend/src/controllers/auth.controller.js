import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sequelize } from "../config/db.js"
import { QueryTypes } from "sequelize"

/* =========================
   REGISTER CUSTOMER
========================= */
export const registerCustomer = async (req, res) => {
  try {
    let { name, email, password } = req.body

    // Trim input (hindari spasi tersembunyi)
    name = name?.trim()
    email = email?.trim()
    password = password?.trim()

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" })
    }

    // Cek email sudah ada atau belum
    const existingUser = await sequelize.query(
      "SELECT id FROM customers WHERE email = :email",
      {
        replacements: { email },
        type: QueryTypes.SELECT
      }
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" })
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10)

    await sequelize.query(
      `INSERT INTO customers (name, email, password)
      VALUES (:name, :email, :password)`,
      {
        replacements: {
          name,
          email,
          password: hashedPassword
        },
        type: QueryTypes.INSERT
      }
    )

    return res.status(201).json({ message: "Register berhasil" })

  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return res.status(500).json({ message: "Server error" })
  }
}


/* =========================
   LOGIN CUSTOMER
========================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body

    email = email?.trim()
    password = password?.trim()

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" })
    }

    /* =====================
       1️⃣ CEK ADMIN DULU
    ===================== */
    const admins = await sequelize.query(
      "SELECT * FROM admins WHERE email = :email",
      {
        replacements: { email },
        type: QueryTypes.SELECT
      }
    )

    if (admins.length > 0) {
      const admin = admins[0]

      const isMatch = await bcrypt.compare(password, admin.password)

      if (!isMatch) {
        return res.status(400).json({ message: "Password salah" })
      }

      const token = jwt.sign(
        { id: admin.id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )

      return res.json({
        token,
        role: "admin"
      })
    }

    /* =====================
       2️⃣ CEK CUSTOMER
    ===================== */
    const customers = await sequelize.query(
      "SELECT * FROM customers WHERE email = :email",
      {
        replacements: { email },
        type: QueryTypes.SELECT
      }
    )

    if (customers.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" })
    }

    const customer = customers[0]

    const isMatch = await bcrypt.compare(password, customer.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" })
    }

    const token = jwt.sign(
      { id: customer.id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    return res.json({
      token,
      role: "customer"
    })

  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return res.status(500).json({ message: "Server error" })
  }
}