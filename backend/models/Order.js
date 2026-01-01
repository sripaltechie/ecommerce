const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, required: true },
    selectedVariant: String, // e.g., "Size: XL" or "Volume: 2000ml"
    price: Number // Price at the time of purchase
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    area: String, // Benz Circle, Patamata, etc.
    lat: Number,
    lng: Number,
    addressLine: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Assigned personal delivery boy
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);