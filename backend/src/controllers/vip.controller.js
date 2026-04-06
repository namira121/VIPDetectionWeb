import VipGuest from "../models/vipGuest.model.js"  // ← tambah ini
import { createVipGuest, getVipsByOrder } from "../services/vip.service.js"

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

export const getVipsByOrderController = async (req, res) => {
  try {
    const vips = await getVipsByOrder(req.params.order_id)
    res.json(vips)
  } catch (error) {
    console.error("ERROR getVipsByOrder:", error)  // ← tambah ini
    res.status(500).json({ message: error.message })
  }
}

export const deleteVipController = async (req, res) => {
  try {
    const vip = await VipGuest.findByPk(req.params.id)
    if (!vip) return res.status(404).json({ message: "VIP tidak ditemukan" })
    await vip.destroy()
    res.json({ message: "VIP berhasil dihapus" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getVipsByOrderPublicController = async (req, res) => {
  try {
    const vips = await getVipsByOrder(req.params.order_id)
    res.json(vips)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
