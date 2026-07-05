const express = require('express');
const {
  allOrders,
  updateStatus,
  placeOrder,
  placeOrderStrip,
  placeOrderRazorpay,
  userOrders
} = require('../Controller/orderController');

const { adminAuth } = require('../Middleware/adminAuth');
const { authUser } = require('../Middleware/auth');

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User order routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStrip);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/userorders', authUser, userOrders);

// Export ONLY the router
module.exports = orderRouter;
