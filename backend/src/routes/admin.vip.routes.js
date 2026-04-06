import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"
import {
  getAllVipGuestsController,
  deleteVipGuestController,
} from "../controllers/admin.vip.controller.js"

const router = express.Router()

router.get("/vip-guests", authAdmin, getAllVipGuestsController)
router.delete("/vip-guests/:id", authAdmin, deleteVipGuestController)

export default router