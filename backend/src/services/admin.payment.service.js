import Payment from "../models/payment.model.js"
import Order from "../models/order.model.js"

export const verifyPayment = async (paymentId, status) => {
  const payment = await Payment.findByPk(paymentId)
  if (!payment) throw new Error("Payment not found")

  payment.payment_status = status
  payment.paid_at = status === "approved" ? new Date() : null  // ← ganti success → approved
  await payment.save()

  if (status === "approved") {  // ← ganti success → approved
    const order = await Order.findByPk(payment.order_id)
    order.status = "paid"
    await order.save()
  }

  return payment
}
