const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
router.post('/', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  // Check if user exists
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ error: "Username already taken" });

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
    role: role || 'staff'
  });

  // Generate token
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { username: user.username, role: user.role, id: user._id } });
});

module.exports = router;