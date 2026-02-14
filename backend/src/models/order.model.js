import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    event_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    event_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    event_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: false,
    createdAt: "created_at",
  }
)

export default Order
