const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shop, items, deliveryAddress, totalAmount } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      customer: req.user.id,
      shop,
      items,
      totalAmount,
      deliveryAddress
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get orders for a logged in user (Customer)
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user.id }).populate('shop', 'shopName');
  res.json(orders);
};