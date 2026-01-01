const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order with Inventory Tracking
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

    // Loop through each item in the order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

      // 1. Calculate Price based on Variants (if any)
      let priceModifier = 0;
      let selectedVariantObj = null;

      if (item.selectedVariant && product.variants && product.variants.length > 0) {
        selectedVariantObj = product.variants.find(v => v.value === item.selectedVariant);
        if (selectedVariantObj) {
          priceModifier = selectedVariantObj.priceModifier;
        }
      }

      const itemPrice = product.basePrice + priceModifier;
      totalAmount += itemPrice * item.quantity;

      // 2. Inventory Tracking Logic
      if (product.trackInventory) {
        if (item.selectedVariant && selectedVariantObj) {
          // Check Variant Stock
          if (selectedVariantObj.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.selectedVariant})` });
          }
          selectedVariantObj.stock -= item.quantity;
        } else {
          // Check Main Product Stock (No variants or variant not specified)
          if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
          }
          product.stock -= item.quantity;
        }

        // 3. Automatic "Sold Out" Check
        if (product.variants && product.variants.length > 0) {
          // If all variants combined are 0, mark product sold out
          const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
          if (totalStock <= 0) product.isSoldOut = true;
        } else {
          // No variants, check main stock
          if (product.stock <= 0) product.isSoldOut = true;
        }

        // Save the updated stock/status to the database
        await product.save();
      }

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
// @route   GET /api/orders/shop/:shopId
exports.getShopOrders = async (req, res) => {
  try {
    const orders = await Order.find({ shop: req.params.shopId })
      .populate('customer', 'name phone')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};