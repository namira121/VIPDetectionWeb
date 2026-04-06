import { getAllVipGuests, deleteVipGuest } from "../services/admin.vip.service.js"

export const getAllVipGuestsController = async (req, res) => {
  try {
    const vips = await getAllVipGuests()
    res.json(vips)
  } catch (error) {
    console.error("ERROR getAllVipGuests:", error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteVipGuestController = async (req, res) => {
  try {
    await deleteVipGuest(req.params.id)
    res.json({ message: "VIP Guest berhasil dihapus" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}