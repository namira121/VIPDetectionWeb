import Order from "../models/order.model.js"
import Package from "../models/package.model.js"

export const createOrder = async (customerId, data) => {
  const pkg = await Package.findByPk(data.package_id)

  if (!pkg) {
    throw new Error("Package not found")
  }

  const order = await Order.create({
    customer_id: customerId,
    package_id: pkg.id,
    total_amount: pkg.price,

    event_name: data.event_name,
    event_date: data.event_date,
    event_start_time: data.event_start_time,
    event_end_time: data.event_end_time,
    location: data.location,
  })

  return order
}

export const getOrdersByCustomer = async (customerId) => {
  return Order.findAll({
    where: { customer_id: customerId },
    order: [["created_at", "DESC"]],
  })
}
