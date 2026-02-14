import Order from "../models/order.model.js"
import VipGuest from "../models/vipGuest.model.js"

export const requirePaidOrderAndVipLimit = async (req, res, next) => {
  try {
    const { order_id } = req.body

    if (!order_id) {
      return res.status(400).json({ message: "order_id required" })
    }

    const order = await Order.findByPk(order_id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.customer_id !== req.customer.id) {
      return res.status(403).json({ message: "Not your order" })
    }

    if (order.status !== "paid") {
      return res.status(403).json({ message: "Order not paid yet" })
    }

    const vipCount = await VipGuest.count({
      where: { order_id },
    })

    if (vipCount >= 30) {
      return res
        .status(400)
        .json({ message: "VIP limit reached (max 30)" })
    }

    req.order = order
    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
