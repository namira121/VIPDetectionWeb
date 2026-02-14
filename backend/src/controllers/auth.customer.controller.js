import {
  registerCustomer,
  loginCustomer,
} from "../services/auth.customer.service.js"

export const customerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" })
    }

    const customer = await registerCustomer(name, email, password)
    res.status(201).json(customer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" })
    }

    const result = await loginCustomer(email, password)
    res.json(result)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}
