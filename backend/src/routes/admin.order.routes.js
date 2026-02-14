import express from "express"
import {
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/admin.order.controller.js"
import { authAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

// admin lihat semua order
router.get("/orders", authAdmin, getAllOrdersController)

// admin update status order
router.patch("/orders/:id/status", authAdmin, updateOrderStatusController)

export default router
