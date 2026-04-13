import Order from '../models/order.model.js'
import Customer from '../models/customer.model.js'
import VipGuest from '../models/vipGuest.model.js'
import Payment from '../models/payment.model.js'
import Package from '../models/package.model.js'
import '../models/associations.js'

export const getAdminStats = async () => {
  const totalOrders = await Order.count()

  const totalCustomers = await Customer.count()

  const totalVips = await VipGuest.count()

  const revenueResult = await Payment.sum('amount', {
    where: { payment_status: 'approved' }  // ← ganti dari status ke payment_status
  })

  return {
    totalOrders,
    totalCustomers,
    totalVips,
    revenue: revenueResult || 0
  }
}

export const getRecentOrders = async () => {
  const orders = await Order.findAll({
    limit: 10,
    order: [['id', 'DESC']],
    include: [
      { model: Customer, attributes: ['name'] },
      { model: Package, attributes: ['name'] },
    ],
    attributes: ['id', 'event_name', 'event_date', 'status']
  })

  return orders
}