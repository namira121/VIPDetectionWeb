import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"

const router = express.Router()

router.get("/dashboard", authAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    adminId: req.user.id,
  })
})

export default router