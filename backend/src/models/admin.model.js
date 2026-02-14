import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "admins",
    timestamps: false,
    createdAt: "created_at",
  }
)

export default Admin
