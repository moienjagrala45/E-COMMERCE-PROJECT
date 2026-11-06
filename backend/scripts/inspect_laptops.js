const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = require('../models/Product');
  const Order = require('../models/Order');

  const allProducts = await Product.find({});
  console.log('Total products in DB:', allProducts.length);

  const laptops = await Product.find({ category: { $regex: /laptop/i } });
  console.log('Total laptops found:', laptops.length);
  laptops.forEach(l => {
    console.log(JSON.stringify({ _id: l._id.toString(), name: l.name, price: l.price, stock: l.stock, isVisible: l.isVisible }));
  });

  const orders = await Order.find({});
  console.log('\nChecking order references to laptops:');
  const laptopIds = laptops.map(l => l._id.toString());
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const pId = item.product ? item.product.toString() : '';
      if (laptopIds.includes(pId)) {
        console.log(`Order ${o._id} references laptop ${pId}`);
      }
    });
  });

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
