const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  phone: String,
  role: { type: String, enum: ['buyer','seller'], default: 'buyer' },
  avatar_url: String
});

module.exports = mongoose.model('User', UserSchema);
