const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['customer', 'seller', 'delivery'], 
    default: 'customer' 
  },
  address: {
    area: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: {type:[Number] ,default:[80.6480, 16.5062]}
    }
  }
}, { timestamps: true });

// --- PRE-SAVE HOOK: Hashes password automatically before saving ---
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // next(); // <--- Make sure this is called!
  } catch (error) {
    throw error; // Pass error to next middleware
  }
});

// --- SCHEMA METHOD: Compares entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);