const express = require('express');
const router = express.Router();
const { createOrder, getShopOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/shop', protect, authorize('seller'), getShopOrders);

module.exports = router;