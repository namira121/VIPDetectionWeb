import { getMonthlySummary } from "../services/admin.report.service.js"

export const getMonthlySummaryController = async (req, res) => {
  try {
    const data = await getMonthlySummary()
    res.json(data)
  } catch (error) {
    console.error("ERROR getMonthlySummary:", error)
    res.status(500).json({ message: error.message })
  }
}