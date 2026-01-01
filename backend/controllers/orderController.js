const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shopId, items, deliveryAddress } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Calculate prices based on variants
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

      // Find the specific variant selected (e.g., "1kg" or "XL")
      const variant = product.variants.find(v => v.value === item.selectedVariant);
      const priceModifier = variant ? variant.priceModifier : 0;
      
      const itemPrice = product.basePrice + priceModifier;
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
        price: itemPrice
      });
    }

    const order = new Order({
      customer: req.user.id,
      shop: shopId,
      items: orderItems,
      totalAmount,
      deliveryAddress
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get orders for a specific Shop (for the Seller app)
// @route   GET /api/orders/shop
exports.getShopOrders = async (req, res) => {
  try {
    // Logic to find shops owned by the user and return their orders
    res.json({ message: "Shop orders logic here" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};