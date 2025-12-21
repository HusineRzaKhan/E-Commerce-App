const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/products - create product (seller only)
router.post('/', auth, async (req, res) => {
  try {
    // require seller role
    const userReq = req.user;
    const { name, description, price, image_url, category, stock } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Missing fields' });
    // fetch user role
    const User = require('../models/User');
    const u = await User.findById(userReq.id);
    if (!u || u.role !== 'seller') return res.status(403).json({ message: 'Only sellers can add products' });
    const product = new Product({ name, description, price, image_url, category, stock, owner: u._id });
    await product.save();
    res.json(product);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// GET /api/products - list with optional ?search=&category=
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  const q = {};
  if (req.query.owner) q.owner = req.query.owner;
  if (search) q.name = { $regex: search, $options: 'i' };
  if (category) q.category = category;
  try {
    const products = await Product.find(q).limit(100);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
