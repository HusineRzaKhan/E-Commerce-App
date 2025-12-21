const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'AliyanAsghar';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hash, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET profile
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    if (!u) return res.status(404).json({ message: 'Not found' });
    res.json(u);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Update profile
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const updates = {};
    const allowed = ['name', 'address', 'phone', 'avatar_url'];
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
