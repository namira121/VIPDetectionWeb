import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js"

export const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ where: { email } })

  if (!admin) {
    throw new Error("Admin not found")
  }
  
  if (password !== admin.password) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign(
    { id: admin.id, type: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
  }
}

