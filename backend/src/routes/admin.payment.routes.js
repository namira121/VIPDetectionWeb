import express from "express"
import { verifyPaymentController } from "../controllers/admin.payment.controller.js"
import { authAdmin } from "../middlewares/admin.middleware.js"

const router = express.Router()

router.patch("/payments/:id/verify", authAdmin, verifyPaymentController)

export default router
