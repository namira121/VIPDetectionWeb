import Order from "../models/order.model.js"
import Customer from "../models/customer.model.js"
import Package from "../models/package.model.js"
import Payment from "../models/payment.model.js"

export const getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [
      { model: Customer, attributes: ["id", "name", "email"] },
      { model: Package, attributes: ["id", "name", "price"] },
      { model: Payment, attributes: ["id", "payment_status", "proof_path"] },
    ],
    order: [["created_at", "DESC"]],
  })

  console.log(JSON.stringify(orders[0], null, 2))  // ← tambah ini
  return orders
}

export const deleteOrder = async (orderId) => {
  const order = await Order.findByPk(orderId)
  if (!order) throw new Error("Order not found")
  await order.destroy()
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
