const User = require('../models/User');
const jwt = require('jsonwebtoken'); // bcrypt is no longer needed here!

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, area } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create User 
    // Just pass 'password' directly. The UserSchema hook will hash it.
    user = new User({
      name, 
      email, 
      phone, 
      role,
      password, // Pass plain password here
      address: { area }
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully in Vijayawada!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    // Use the schema method we created (matchPassword)
    if (user && (await user.matchPassword(password))) {
      // Create JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ 
        token, 
        user: { id: user._id, name: user.name, role: user.role } 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};