const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Add a product with variants (Size, Color, Weight, etc.)
// @route   POST /api/products/:shopId
// @access  Private/Seller
exports.addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      basePrice, 
      category, 
      image,
      stock,
      trackInventory,
      variants, // Array of {type, value, priceModifier, stock}
      specs,    // {weight, dimensions: {length, width, height}}
      isVeg 
    } = req.body;

    const shopId = req.params.shopId;

    // 1. Verify the shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 2. Security: Ensure the person adding the product owns this shop
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify this shop" });
    }

    // Logic to determine initial "Sold Out" status
    let isSoldOut = false;
    if (trackInventory) {
      if (variants && variants.length > 0) {
        // If all variants are 0, product is sold out
        const totalVariantStock = variants.reduce((acc, curr) => acc + curr.stock, 0);
        isSoldOut = totalVariantStock <= 0;
      } else {
        // No variants, check main stock
        isSoldOut = stock <= 0;
      }
    }

    

    // 3. Create the product with new complex fields
    const product = new Product({
      shop: shopId,
      name,
      description,
      basePrice,
      category,
      image,
      variants, // Handles L, XL, 2000ml, 1kg, Red, etc.
      specs,    // Handles physical size/weight for delivery logic
      isVeg,
      isSoldOut
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all products for a shop
// @route   GET /api/products/shop/:shopId
exports.getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update Product Stock or Price
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check ownership
    const shop = await Shop.findById(product.shop);
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};