import express from "express"
import { uploadVipController } from "../controllers/vip.controller.js"
import { authCustomer } from "../middlewares/customer.middleware.js"
import { uploadVipPhoto } from "../middlewares/uploadVip.middleware.js"
import { requirePaidOrderAndVipLimit } from "../middlewares/paidOrderVip.middleware.js"

const router = express.Router()

router.post(
  "/upload",
  authCustomer,
  uploadVipPhoto,
  requirePaidOrderAndVipLimit,
  uploadVipController
)

export default router
