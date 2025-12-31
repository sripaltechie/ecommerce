const express = require('express');
const router = express.Router();
const { addProduct, getProductsByShop } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Add product: Only for the shop owner
router.post('/:shopId', protect, authorize('seller'), addProduct);

// View products: Open to all customers in Vijayawada
router.get('/shop/:shopId', getProductsByShop);

module.exports = router;