import Payment from "../models/payment.model.js"
import Order from "../models/order.model.js"

export const createPayment = async (customerId, orderId, proofPath) => {
  const order = await Order.findByPk(orderId)

  if (!order) throw new Error("Order not found")
  if (order.customer_id !== customerId)
    throw new Error("Not your order")
  if (order.status !== "pending")
    throw new Error("Order cannot be paid")

  // create payment (langsung success)
  const payment = await Payment.create({
    order_id: order.id,
    amount: order.total_amount,
    payment_method: "transfer",
    payment_status: "success",
    proof_path: proofPath,
    paid_at: new Date(),
  })

  // update order langsung paid
  order.status = "paid"
  await order.save()

  return payment
}
