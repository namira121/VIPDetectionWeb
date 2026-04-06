import VipGuest from "../models/vipGuest.model.js"
import Order from "../models/order.model.js"
import Customer from "../models/customer.model.js"

export const getAllVipGuests = async () => {
  return VipGuest.findAll({
    include: [
      {
        model: Order,
        attributes: ["id", "event_name", "event_date"],
        include: [
          { model: Customer, attributes: ["id", "name", "email"] }
        ]
      }
    ],
    order: [["id", "DESC"]],
  })
}

export const deleteVipGuest = async (id) => {
  const vip = await VipGuest.findByPk(id)
  if (!vip) throw new Error("VIP Guest tidak ditemukan")
  await vip.destroy()
}