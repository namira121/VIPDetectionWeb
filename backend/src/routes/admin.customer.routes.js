import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"
import {
  getAllCustomersController,
  getCustomerByIdController,
  deleteCustomerController,
} from "../controllers/admin.customer.controller.js"

const router = express.Router()

router.get("/customers", authAdmin, getAllCustomersController)
router.get("/customers/:id", authAdmin, getCustomerByIdController)
router.delete("/customers/:id", authAdmin, deleteCustomerController)

export default router