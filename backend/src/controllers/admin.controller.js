import {
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} from "../services/admin.customer.service.js"

export const getAllCustomersController = async (req, res) => {
  try {
    const customers = await getAllCustomers()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCustomerByIdController = async (req, res) => {
  try {
    const customer = await getCustomerById(req.params.id)
    res.json(customer)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteCustomerController = async (req, res) => {
  try {
    await deleteCustomer(req.params.id)
    res.json({ message: "Customer berhasil dihapus" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}