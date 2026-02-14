import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const VipGuest = sequelize.define(
  "VipGuest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "vip_guests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
)

export default VipGuest
