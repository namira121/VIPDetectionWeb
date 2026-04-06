import express from "express"
import { uploadVipController, getVipsByOrderController, deleteVipController, getVipsByOrderPublicController, } from "../controllers/vip.controller.js"
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

router.get(
  "/:order_id", 
  authCustomer, 
  getVipsByOrderController
)

router.get("/:order_id/public", getVipsByOrderPublicController)

router.delete(
  "/:id", 
  authCustomer, 
  deleteVipController)

export default router
