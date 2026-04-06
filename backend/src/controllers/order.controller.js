import Order from "../models/order.model.js"      // ← tambah
import Package from "../models/package.model.js"  // ← tambah
import {
  createOrder,
  getOrdersByCustomer,
} from "../services/order.service.js"

export const createOrderController = async (req, res) => {
  try {
    const {
      package_id,
      event_name,
      event_date,
      event_start_time,
      event_end_time,
      location,
    } = req.body

    if (
      !package_id ||
      !event_name ||
      !event_date ||
      !event_start_time ||
      !event_end_time ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const order = await createOrder(req.user.id, {
      package_id,
      event_name,
      event_date,
      event_start_time,
      event_end_time,
      location,
    })

    res.status(201).json(order)

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const cancelOrderController = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, customer_id: req.user.id }
    })
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" })
    if (order.status !== "pending") return res.status(400).json({ message: "Order tidak bisa dibatalkan" })

    order.status = "cancelled"
    await order.save()
    res.json({ message: "Order berhasil dibatalkan" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyOrdersController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const orders = await getOrdersByCustomer(req.user.id)

    res.json(orders)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderByIdController = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, customer_id: req.user.id },
      include: [{ model: Package, attributes: ["name", "price"] }]
    })

    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" })

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderByIdPublicController = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: ["id", "event_name", "event_date", "event_start_time", "event_end_time", "status"],
      include: [{ model: Package, attributes: ["name"] }]
    })
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
