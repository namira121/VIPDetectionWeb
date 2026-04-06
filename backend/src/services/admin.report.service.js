import { sequelize } from "../config/db.js"
import Order from "../models/order.model.js"
import Payment from "../models/payment.model.js"
import Package from "../models/package.model.js"
import Customer from "../models/customer.model.js"
import { Op, fn, col, literal } from "sequelize"

export const getMonthlySummary = async () => {
  const payments = await Payment.findAll({
    where: { payment_status: "approved" },
    include: [{
      model: Order,
      include: [
        { model: Package, attributes: ["name"] },
        { model: Customer, attributes: ["name"] }
      ]
    }],
    order: [["paid_at", "DESC"]]
  })

  // Group by bulan
  const monthly = {}
  for (const p of payments) {
    const date = new Date(p.paid_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!monthly[key]) {
      monthly[key] = { month: key, total_revenue: 0, total_orders: 0, orders: [] }
    }
    monthly[key].total_revenue += Number(p.amount)
    monthly[key].total_orders += 1
    monthly[key].orders.push({
      id: p.Order?.id,
      event_name: p.Order?.event_name,
      customer: p.Order?.Customer?.name,
      package: p.Order?.Package?.name,
      amount: Number(p.amount),
      paid_at: p.paid_at,
    })
  }

  return Object.values(monthly).sort((a, b) => b.month.localeCompare(a.month))
}