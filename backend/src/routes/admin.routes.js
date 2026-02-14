import express from "express"
import { authAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/dashboard", authAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    adminId: req.admin.id,
  })
})

export default router
