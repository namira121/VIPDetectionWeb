import express from "express"
import { getPackagesController } from "../controllers/package.controller.js"

const router = express.Router()

// public endpoint
router.get("/", getPackagesController)

export default router
