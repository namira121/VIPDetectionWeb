import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../services/admin.package.service.js"

export const getPackagesController = async (req, res) => {
  res.json(await getPackages())
}

export const createPackageController = async (req, res) => {
  try {
    const { name, price } = req.body
    if (!name || !price) {
      return res.status(400).json({ message: "Name & price required" })
    }

    const pkg = await createPackage({ name, price })
    res.status(201).json(pkg)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updatePackageController = async (req, res) => {
  try {
    const pkg = await updatePackage(req.params.id, req.body)
    res.json(pkg)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deletePackageController = async (req, res) => {
  try {
    await deletePackage(req.params.id)
    res.json({ message: "Package deleted" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
