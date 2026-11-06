const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require('../models/Product');
  const prods = await Product.find({ isVisible: { $ne: false } });

  console.log("Testing with full browser cross-site image headers...\n");

  for (const p of prods) {
    try {
      const res = await fetch(p.image, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
          'Referer': 'http://localhost:5173/'
        }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.startsWith('image/')) {
        console.log(`FAIL [${res.status}] ${p.category} | ${p.name}`);
        console.log(`  URL: ${p.image}`);
        console.log(`  Content-Type: ${ct}\n`);
      } else {
        // success
      }
    } catch (e) {
      console.log(`ERROR: ${p.category} | ${p.name}: ${e.message}`);
    }
  }

  console.log("Browser headers test finished.");
  await mongoose.disconnect();
}

run().catch(console.error);

