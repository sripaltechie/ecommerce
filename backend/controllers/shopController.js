const Shop = require('../models/Shop');

// @desc    Create a new shop
// @route   POST /api/shops
// @access  Private/Seller
exports.createShop = async (req, res) => {
  try {
    const { shopName, category, description,image, area, coordinates } = req.body;

    const shop = new Shop({
      owner: req.user.id, // From protect middleware
      shopName,
      category,
      description,
      image,
      location: {
        type: 'Point',
        coordinates: coordinates // [longitude, latitude]
      },
      area
    });

    const savedShop = await shop.save();
    res.status(201).json(savedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all shops in Vijayawada
// @route   GET /api/shops
// @access  Public
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};