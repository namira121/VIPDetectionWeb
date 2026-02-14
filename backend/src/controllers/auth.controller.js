import { loginAdmin } from "../services/auth.service.js"

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" })
    }

    const result = await loginAdmin(email, password)
    res.json(result)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}
