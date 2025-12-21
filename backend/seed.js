const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const products = [
  { name: 'Red T-Shirt', description: 'Comfortable cotton t-shirt', price: 19.99, image_url: 'https://via.placeholder.com/200', category: 'Clothing', stock: 100 },
  { name: 'Blue Jeans', description: 'Stylish denim', price: 49.99, image_url: 'https://via.placeholder.com/200', category: 'Clothing', stock: 50 },
  { name: 'Wireless Headphones', description: 'Noise-cancelling', price: 89.99, image_url: 'https://via.placeholder.com/200', category: 'Electronics', stock: 30 },
  { name: 'Coffee Mug', description: 'Ceramic mug', price: 9.99, image_url: 'https://via.placeholder.com/200', category: 'Home', stock: 200 }
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected, seeding products...');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded.');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
