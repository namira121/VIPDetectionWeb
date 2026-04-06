import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"  // ← satu saja
import {
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController
} from "../controllers/admin.order.controller.js"

const router = express.Router()

router.get("/orders", authAdmin, getAllOrdersController)
router.delete("/orders/:id", authAdmin, deleteOrderController)  // ← tambah
router.patch("/orders/:id/status", authAdmin, updateOrderStatusController)  // ← satu saja

export default router