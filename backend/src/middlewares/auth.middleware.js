import jwt from "jsonwebtoken"

export const authAdmin = (req, res, next) => {
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

    if (decoded.type !== "admin") {
      return res.status(403).json({ message: "Admin only" })
    }

    req.admin = decoded // { id, type }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
