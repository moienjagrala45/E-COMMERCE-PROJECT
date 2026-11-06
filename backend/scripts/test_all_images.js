const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require('../models/Product');
  const prods = await Product.find({ isVisible: { $ne: false } });
  console.log(`Checking ${prods.length} products...\n`);

  for (const p of prods) {
    try {
      const res = await fetch(p.image, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'http://localhost:5173/'
        }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.startsWith('image/')) {
        console.log(`FAIL [${res.status}] ${p.category} | ${p.name}`);
        console.log(`  URL: ${p.image}`);
        console.log(`  Content-Type: ${ct}\n`);
      } else {
        console.log(`OK [${res.status}] ${p.category} | ${p.name}`);
      }
    } catch (err) {
      console.log(`ERROR: ${p.category} | ${p.name} -> ${err.message}`);
      console.log(`  URL: ${p.image}\n`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);

