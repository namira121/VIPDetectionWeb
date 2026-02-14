import express from "express"
import { createPaymentController } from "../controllers/payment.controller.js"
import { authCustomer } from "../middlewares/customer.middleware.js"
import { uploadPaymentProof } from "../middlewares/uploadPayment.middleware.js"

const router = express.Router()

router.post(
  "/",
  authCustomer,
  uploadPaymentProof,
  createPaymentController
)

export default router
