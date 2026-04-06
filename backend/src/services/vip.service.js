import VipGuest from "../models/vipGuest.model.js"

export const createVipGuest = async (orderId, name, photoPath) => {
  return await VipGuest.create({
    order_id: orderId,
    name,
    photo_path: photoPath,
  })
}

export const getVipsByOrder = async (orderId) => {
  return await VipGuest.findAll({
    where: { order_id: orderId }
  })
}

export const deleteVipGuest = async (id) => {
  const vip = await VipGuest.findByPk(id)
  if (!vip) throw new Error("VIP tidak ditemukan")
  await vip.destroy()
}
