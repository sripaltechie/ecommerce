const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Food', 'Grocery', 'Pharmacy', 'Electronics', 'Other'], 
    required: true 
  },
  description: String,
  image: String, // URL of shop banner
  isVerified: { type: Boolean, default: false },
  
  // Status to show if the shop is currently taking orders
  isOpen: { type: Boolean, default: true },
  area: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }
});

shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Shop', shopSchema);