const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

// Connect DB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/seller', require('./routes/seller'));

app.get('/', (req, res) => res.send({status:'ok', message: 'Ecommerce backend running'}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
