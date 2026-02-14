import express from "express"
import {
  createOrderController,
  getMyOrdersController,
} from "../controllers/order.controller.js"
import { authCustomer } from "../middlewares/customer.middleware.js"

const router = express.Router()

router.post("/", authCustomer, createOrderController)
router.get("/my", authCustomer, getMyOrdersController)

export default router
