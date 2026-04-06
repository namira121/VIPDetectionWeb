import Order from "./order.model.js"
import Package from "./package.model.js"
import Customer from "./customer.model.js"
import Payment from "./payment.model.js"
import VipGuest from "./vipGuest.model.js"

Order.belongsTo(Package, { foreignKey: "package_id" })
Order.belongsTo(Customer, { foreignKey: "customer_id" })
Order.hasOne(Payment, { foreignKey: "order_id" })
VipGuest.belongsTo(Order, { foreignKey: "order_id" })
Payment.belongsTo(Order, { foreignKey: "order_id" })