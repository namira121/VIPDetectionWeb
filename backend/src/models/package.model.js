import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Package = sequelize.define(
  "Package",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    max_vip: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 15 },    // ← tambah
    max_hours: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },   // ← tambah
  },
  {
    tableName: "packages",
    timestamps: false,
  }
)

export default Package
