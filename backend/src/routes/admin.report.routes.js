import express from "express"
import { authAdmin } from "../middlewares/admin.middleware.js"
import { getMonthlySummaryController } from "../controllers/admin.report.controller.js"

const router = express.Router()

router.get("/reports", authAdmin, getMonthlySummaryController)

export default router