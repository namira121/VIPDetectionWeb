import Order from "../models/order.model.js"
import Package from "../models/package.model.js"  // ← tambah
import VipGuest from "../models/vipGuest.model.js"

export const requirePaidOrderAndVipLimit = async (req, res, next) => {
  try {
    const { order_id } = req.body
    if (!order_id) return res.status(400).json({ message: "order_id required" })

    const order = await Order.findByPk(order_id, {
      include: [{ model: Package }]  // ← include Package
    })
    console.log("ORDER:", JSON.stringify(order, null, 2))  // ← tambah ini
    console.log("PACKAGE:", order?.Package)                // ← tambah ini
    if (!order) return res.status(404).json({ message: "Order not found" })
    if (order.customer_id !== req.user.id) return res.status(403).json({ message: "Not your order" })
    if (order.status !== "paid") return res.status(403).json({ message: "Order not paid yet" })

    const vipCount = await VipGuest.count({ where: { order_id } })
    const maxVip = order.Package?.max_vip || 15  // ← pakai max_vip dari paket

    if (vipCount >= maxVip) {
      return res.status(400).json({ message: `Batas tamu VIP paket ${order.Package?.name} adalah ${maxVip} orang` })
    }

    req.order = order
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}