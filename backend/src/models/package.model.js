import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "packages",
    timestamps: false,
    createdAt: "created_at",
  }
)

export default Package
