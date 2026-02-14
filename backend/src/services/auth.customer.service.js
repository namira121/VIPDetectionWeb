import jwt from "jsonwebtoken"
import Customer from "../models/customer.model.js"

export const registerCustomer = async (name, email, password) => {
  const existing = await Customer.findOne({ where: { email } })
  if (existing) {
    throw new Error("Email already registered")
  }

  const customer = await Customer.create({
    name,
    email,
    password, // sementara plain text
  })

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
  }
}

export const loginCustomer = async (email, password) => {
  const customer = await Customer.findOne({ where: { email } })
  if (!customer) {
    throw new Error("Customer not found")
  }

  if (password !== customer.password) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign(
    { id: customer.id, type: "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  return {
    token,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    },
  }
}
