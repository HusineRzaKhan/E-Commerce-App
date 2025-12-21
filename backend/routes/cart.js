const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart - user cart
router.get('/', auth, async (req, res) => {
  try {
    const items = await Cart.find({ user_id: req.user.id }).populate('product_id');
    res.json(items);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// POST /api/cart - add item { product_id, quantity }
router.post('/', auth, async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    let item = await Cart.findOne({ user_id: req.user.id, product_id });
    if (item) {
      item.quantity = (item.quantity || 1) + (quantity || 1);
      await item.save();
    } else {
      item = new Cart({ user_id: req.user.id, product_id, quantity: quantity || 1 });
      await item.save();
    }
    res.json(item);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// PUT /api/cart/:id - update quantity
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (String(item.user_id) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    item.quantity = req.body.quantity || item.quantity;
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// DELETE /api/cart/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (String(item.user_id) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await item.remove();
    res.json({ message: 'Removed' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
