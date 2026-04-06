import express from "express"
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  cancelOrderController,
  getOrderByIdPublicController,
} from "../controllers/order.controller.js"
import { authCustomer } from "../middlewares/customer.middleware.js"

const router = express.Router()

router.post("/", authCustomer, createOrderController)
router.get("/my", authCustomer, getMyOrdersController)
router.get("/:id", authCustomer, getOrderByIdController)
router.patch("/:id/cancel", authCustomer, cancelOrderController)
router.get("/:id/public", getOrderByIdPublicController)

export default router
