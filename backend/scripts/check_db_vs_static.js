const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require('../models/Product');
  const prods = await Product.find({ isVisible: { $ne: false } });

  const { EXISTING_STORE_PRODUCTS } = await import('../../frontend/src/data/productsData.js');

  console.log("Checking differences between DB and productsData.js:\n");

  prods.forEach(dbP => {
    const staticP = EXISTING_STORE_PRODUCTS.find(p =>
      p.name?.trim().toLowerCase() === dbP.name?.trim().toLowerCase() ||
      String(p._id) === String(dbP._id)
    );
    if (!staticP) {
      console.log(`NOT IN STATIC CATALOG: ${dbP.name} [${dbP._id}]`);
    } else {
      if (staticP.image !== dbP.image) {
        console.log(`IMAGE MISMATCH for ${dbP.name}:`);
        console.log(`  DB:     ${dbP.image}`);
        console.log(`  Static: ${staticP.image}`);
      }
      if (String(staticP._id) !== String(dbP._id)) {
        console.log(`ID MISMATCH for ${dbP.name}: DB=${dbP._id} vs Static=${staticP._id}`);
      }
    }
  });

  await mongoose.disconnect();
}

run().catch(console.error);

