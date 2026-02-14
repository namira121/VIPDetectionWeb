import VipGuest from "../models/vipGuest.model.js"

export const createVipGuest = async (orderId, name, photoPath) => {
  return await VipGuest.create({
    order_id: orderId,
    name,
    photo_path: photoPath,
  })
}
