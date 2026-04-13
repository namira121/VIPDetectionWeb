import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"
import { getAdminDashboardStats, getAdminRecentOrders } from "../controllers/admin.dashboard.controller.js"

const router = express.Router()

router.get("/dashboard", authAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    adminId: req.user.id,
  })
})

router.get("/dashboard-stats", authAdmin, getAdminDashboardStats)
router.get("/recent-orders", authAdmin, getAdminRecentOrders)

export default router