const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  
  // Distinguish between users
  role: { 
    type: String, 
    enum: ['customer', 'seller', 'delivery'], 
    default: 'customer' 
  },

  // For Vijayawada localization
  address: {
    area: { type: String, required: true  }, // e.g., Benz Circle, One Town
    street: String,
    pincode: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },

  createdAt: { type: Date, default: Date.now }
});

// Index for location-based searches
userSchema.index({ "address.location": "2dsphere" });

module.exports = mongoose.model('User', userSchema);