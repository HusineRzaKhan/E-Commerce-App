const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  total_amount: Number,
  status: { type: String, default: 'pending' },
  order_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
