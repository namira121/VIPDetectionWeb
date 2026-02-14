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

    if (!req.customer) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const order = await createOrder(req.customer.id, {
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

export const getMyOrdersController = async (req, res) => {
  try {
    if (!req.customer) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const orders = await getOrdersByCustomer(req.customer.id)

    res.json(orders)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
