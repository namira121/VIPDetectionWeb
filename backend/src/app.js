import express from "express"
import cors from "cors"
import "./models/associations.js"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import orderRoutes from "./routes/order.routes.js"
import packageRoutes from "./routes/package.routes.js"
import adminOrderRoutes from "./routes/admin.order.routes.js"
import adminPackageRoutes from "./routes/admin.package.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import adminPaymentRoutes from "./routes/admin.payment.routes.js"
import adminCustomerRoutes from "./routes/admin.customer.routes.js"
import adminVipRoutes from "./routes/admin.vip.routes.js"
import adminReportRoutes from "./routes/admin.report.routes.js"
import vipRoutes from "./routes/vip.routes.js"
import path from "path"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)
app.use("/orders", orderRoutes)
app.use("/packages", packageRoutes)
app.use("/admin", adminOrderRoutes)
app.use("/admin", adminPackageRoutes)
app.use("/payments", paymentRoutes)
app.use("/admin", adminPaymentRoutes)
app.use("/uploads", express.static(path.resolve("uploads")))
app.use("/vip", vipRoutes)
app.use("/admin", adminCustomerRoutes)
app.use("/admin", adminVipRoutes)
app.use("/admin", adminReportRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

export default app