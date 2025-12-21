const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image_url: String,
  category: String,
  stock: { type: Number, default: 0 }
});

ProductSchema.add({ owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } });

module.exports = mongoose.model('Product', ProductSchema);
