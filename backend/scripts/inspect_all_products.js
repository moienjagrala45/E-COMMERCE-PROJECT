const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require('../models/Product');
  const prods = await Product.find({ isVisible: { $ne: false } });
  console.log('Total visible products in DB:', prods.length);
  const byCat = {};
  prods.forEach(p => {
    byCat[p.category] = (byCat[p.category] || 0) + 1;
    console.log(`${p.category} | ${p._id} | ${p.name} | ${p.image}`);
  });
  console.log('Categories:', byCat);
  await mongoose.disconnect();
}

run().catch(console.error);

