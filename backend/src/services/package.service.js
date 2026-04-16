import Package from "../models/package.model.js"

export const getAllPackages = async () => {
  return Package.findAll({
    attributes: ["id", "name", "price", "max_vip", "max_hours"],
    order: [["id", "ASC"]],
  })
}