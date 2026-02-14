import { createPayment } from "../services/payment.service.js"

export const createPaymentController = async (req, res) => {
  try {
    const { order_id } = req.body

    if (!order_id) {
      return res.status(400).json({ message: "order_id required" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "Payment proof required" })
    }

    const payment = await createPayment(
      req.customer.id,
      order_id,
      req.file.path
    )

    res.status(201).json(payment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
