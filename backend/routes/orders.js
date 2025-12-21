const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Notification = require('../models/Notification');
const Product = require('../models/Product');

// POST /api/orders - create order from cart
router.post('/', auth, async (req, res) => {
  const { items, total_amount } = req.body; // frontend may send items directly
  try {
    const order = new Order({ user_id: req.user.id, items, total_amount, status: 'placed' });
    await order.save();
    // clear cart for user
    await Cart.deleteMany({ user_id: req.user.id });
    // Create notifications for buyer and sellers
    await Notification.create({ user_id: req.user.id, message: `Your order ${order._id} was placed. Total ${order.total_amount}` });
    // notify sellers of their items
    for (const it of items) {
      try {
        const prod = await Product.findById(it.product_id);
        if (prod && prod.owner) {
          await Notification.create({ user_id: prod.owner, message: `Product ${prod.name} was ordered (${it.quantity} pcs). Order ${order._id}` });
        }
      } catch (e) { console.warn('notify seller error', e); }
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/orders - user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ order_date: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
