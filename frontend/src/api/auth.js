import api from "./axios"

export const loginCustomer = (data) =>
  api.post("/auth/customer/login", data)

export const registerCustomer = (data) =>
  api.post("/auth/customer/register", data)
