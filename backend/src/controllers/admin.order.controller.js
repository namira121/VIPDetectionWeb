import {
  getAllOrders,
  updateOrderStatus,
} from "../services/admin.order.service.js"

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["paid", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await updateOrderStatus(id, status)
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
