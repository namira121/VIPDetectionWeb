const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/dashboard.controller')
const { authenticateCustomer } = require('../middlewares/customer.middleware')

router.get('/stats', authenticateCustomer, getDashboard)

module.exports = router