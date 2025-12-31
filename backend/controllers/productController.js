const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Add a product to a shop
// @route   POST /api/products/:shopId
// @access  Private/Seller
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, isVeg, image } = req.body;
    const shopId = req.params.shopId;

    // 1. Verify the shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // 2. Verify the user calling this is the ACTUAL owner of the shop
    if (shop.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "You don't have permission to add items to this shop" });
    }

    const product = new Product({
      shop: shopId,
      name,
      description,
      price,
      category,
      isVeg,
      image
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all products for a specific shop
// @route   GET /api/products/shop/:shopId
// @access  Public
exports.getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
