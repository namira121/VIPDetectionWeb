import Order from "./order.model.js"
import Customer from "./customer.model.js"
import Package from "./package.model.js"

Order.belongsTo(Customer, { foreignKey: "customer_id" })
Order.belongsTo(Package, { foreignKey: "package_id" })
