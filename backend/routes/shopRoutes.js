const express = require('express');
const router = express.Router();
const { createShop, getShops } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShops) // Anyone can see shops
  .post(protect, authorize('seller'), createShop); // Only sellers can create

module.exports = router;