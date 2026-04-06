import jwt from "jsonwebtoken"

export const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Token tidak ada" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Akses admin saja" })
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" })
  }
}