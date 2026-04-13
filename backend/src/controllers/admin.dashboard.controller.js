import { getAdminStats, getRecentOrders } from '../services/admin.dashboard.service.js'

export const getAdminDashboardStats = async (req, res) => {
  try {
    const stats = await getAdminStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAdminRecentOrders = async (req, res) => {
  try {
    const orders = await getRecentOrders()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}