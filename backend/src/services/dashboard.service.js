import '../models/associations.js'
import Order from '../models/order.model.js'
import VipGuest from '../models/vipGuest.model.js'
import { Op } from 'sequelize'

export const getDashboardStats = async (customerId) => {
  const activeOrders = await Order.count({
    where: { customer_id: customerId, status: ['pending', 'paid'] }
  })

  const totalVips = await VipGuest.count({
    include: [{ model: Order, where: { customer_id: customerId }, attributes: [] }]
  })

  const nextEvent = await Order.findOne({
    where: {
      customer_id: customerId,
      event_date: { [Op.gte]: new Date() },
      status: 'paid'
    },
    order: [['event_date', 'ASC']],
    attributes: ['event_name', 'event_date']
  })

  return { activeOrders, totalVips, nextEvent }
}