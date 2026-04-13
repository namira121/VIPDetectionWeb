import { getDashboardStats } from '../services/dashboard.service.js'

export const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats(req.user.id)
    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}