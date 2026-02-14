import { DataTypes } from "sequelize"
import { sequelize } from "../config/db.js"

const Payment = sequelize.define(
  "Payment",
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

    payment_method: {
      type: DataTypes.ENUM("transfer"),
      defaultValue: "transfer",
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    payment_status: {
      type: DataTypes.ENUM("success"),
      defaultValue: "success",
    },

    proof_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    paid_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
)

export default Payment
