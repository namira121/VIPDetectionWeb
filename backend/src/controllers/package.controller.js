import { getAllPackages } from "../services/package.service.js"

export const getPackagesController = async (req, res) => {
  try {
    const packages = await getAllPackages()
    res.json(packages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
