import express from "express"
import {
  customerRegister,
  customerLogin,
} from "../controllers/auth.customer.controller.js"

const router = express.Router()

router.post("/customer/register", customerRegister)
router.post("/customer/login", customerLogin)

export default router
