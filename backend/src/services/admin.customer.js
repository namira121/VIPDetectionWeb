import Customer from "../models/customer.model.js"

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
  await customer.destroy()
}