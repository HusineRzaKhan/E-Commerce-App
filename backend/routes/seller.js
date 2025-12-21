const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/seller/dashboard - seller products, earnings, new orders
router.get('/dashboard', auth, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ owner: sellerId });
    // earnings: sum of order items matching seller's products where status placed || shipped || completed
    const sellerProductIds = products.map(p => p._id);
    const orders = await Order.find({ 'items.product_id': { $in: sellerProductIds } });
    let earnings = 0;
    let newOrders = 0;
    orders.forEach(o => {
      o.items.forEach(it => {
        if (String(it.product_id) && sellerProductIds.find(id => String(id) === String(it.product_id))) {
          earnings += (it.price || 0) * (it.quantity || 0);
          if (o.status === 'placed') newOrders += 1;
        }
      });
    });
    res.json({ products, earnings, newOrders });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
