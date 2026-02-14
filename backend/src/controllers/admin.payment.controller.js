import { verifyPayment } from "../services/admin.payment.service.js"

export const verifyPaymentController = async (req, res) => {
  try {
    const { status } = req.body

    if (!["success", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const payment = await verifyPayment(req.params.id, status)
    res.json(payment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
