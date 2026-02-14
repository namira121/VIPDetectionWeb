import { createVipGuest } from "../services/vip.service.js"

export const uploadVipController = async (req, res) => {
  try {
    const { name, order_id } = req.body

    if (!name) {
      return res.status(400).json({ message: "VIP name required" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "VIP photo required" })
    }

    const vip = await createVipGuest(
      order_id,
      name,
      req.file.path
    )

    res.status(201).json(vip)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
