const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true }, // Starting price
  category: String,
  image: String,

  // FLEXIBLE VARIANTS
  variants: [{
    type: { 
      type: String, 
      enum: ['Size', 'Weight', 'Volume', 'Color', 'Dimension'], 
      required: true 
    },
    value: { type: String, required: true }, // e.g., "XL", "2000ml", "1kg", "Red"
    priceModifier: { type: Number, default: 0 }, // Extra cost (e.g., +50 for 2XL)
    stock: { type: Number, default: 0 }
  }],

  // Physical specs for delivery boys/shipping
  specs: {
    weight: String, // e.g., "1.5kg"
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },

  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: false } // For Vijayawada restaurants
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);