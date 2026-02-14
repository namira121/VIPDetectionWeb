import jwt from "jsonwebtoken"

export const authCustomer = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ message: "No token" })
  }

  const token = header.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== "customer") {
      return res.status(403).json({ message: "Customer only" })
    }

    req.customer = decoded // { id, type }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
