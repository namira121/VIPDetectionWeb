import Order from "../models/order.model.js"
import Customer from "../models/customer.model.js"
import Package from "../models/package.model.js"

export const getAllOrders = async () => {
  return Order.findAll({
    include: [
      { model: Customer, attributes: ["id", "name", "email"] },
      { model: Package, attributes: ["id", "name", "price"] },
    ],
    order: [["created_at", "DESC"]],
  })
}

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId)
  if (!order) {
    throw new Error("Order not found")
  }

  order.status = status
  await order.save()

  return order
}
