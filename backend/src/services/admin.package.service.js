import Package from "../models/package.model.js"

export const getPackages = async () => {
  return Package.findAll({ order: [["id", "ASC"]] })
}

export const createPackage = async (data) => {
  return Package.create(data)
}

export const updatePackage = async (id, data) => {
  const pkg = await Package.findByPk(id)
  if (!pkg) throw new Error("Package not found")

  return pkg.update(data)
}

export const deletePackage = async (id) => {
  const pkg = await Package.findByPk(id)
  if (!pkg) throw new Error("Package not found")

  await pkg.destroy()
}
