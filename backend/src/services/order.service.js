import Order from "../models/order.model.js"
import Package from "../models/package.model.js"

export const createOrder = async (customerId, data) => {
  const pkg = await Package.findByPk(data.package_id)
  if (!pkg) throw new Error("Package not found")

  // Validasi durasi
  const [startH, startM] = data.event_start_time.split(":").map(Number)
  const [endH, endM] = data.event_end_time.split(":").map(Number)
  const durationHours = (endH * 60 + endM - (startH * 60 + startM)) / 60

  if (durationHours > pkg.max_hours) {
    throw new Error(`Durasi maksimal paket ${pkg.name} adalah ${pkg.max_hours} jam`)
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
    include: [
      {
        model: Package,
        attributes: ["name", "price"], 
      }
    ],
    order: [["created_at", "DESC"]],
  })
}
