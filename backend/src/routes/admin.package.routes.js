import express from "express"
import {
  getPackagesController,
  createPackageController,
  updatePackageController,
  deletePackageController,
} from "../controllers/admin.package.controller.js"
import { authAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/packages", authAdmin, getPackagesController)
router.post("/packages", authAdmin, createPackageController)
router.put("/packages/:id", authAdmin, updatePackageController)
router.delete("/packages/:id", authAdmin, deletePackageController)

export default router
