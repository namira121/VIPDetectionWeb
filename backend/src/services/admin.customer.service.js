import Customer from "../models/customer.model.js"
import Order from "../models/order.model.js"
import Payment from "../models/payment.model.js"
import VipGuest from "../models/vipGuest.model.js"

export const getAllCustomers = async () => {
  return Customer.findAll({
    attributes: ["id", "name", "email"],
    order: [["id", "DESC"]],
  })
}

export const getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id, {
    attributes: ["id", "name", "email"],
  })
  if (!customer) throw new Error("Customer tidak ditemukan")
  return customer
}

export const deleteCustomer = async (id) => {
  const customer = await Customer.findByPk(id)
  if (!customer) throw new Error("Customer tidak ditemukan")

  const orders = await Order.findAll({ where: { customer_id: id } })

  for (const order of orders) {
    await Payment.destroy({ where: { order_id: order.id } })
    await VipGuest.destroy({ where: { order_id: order.id } })
  }

  await Order.destroy({ where: { customer_id: id } })
  await customer.destroy()
}