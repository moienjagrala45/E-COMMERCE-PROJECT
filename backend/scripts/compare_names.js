const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Product = require('../models/Product');
  const prods = await Product.find({ isVisible: { $ne: false } });

  const { EXISTING_STORE_PRODUCTS } = await import('../../frontend/src/data/productsData.js');

  console.log(`DB count: ${prods.length}, Catalog count: ${EXISTING_STORE_PRODUCTS.length}`);

  let unmatched = 0;
  prods.forEach(dbProd => {
    const found = EXISTING_STORE_PRODUCTS.find(catProd =>
      catProd.name?.trim().toLowerCase() === dbProd.name?.trim().toLowerCase() ||
      String(catProd._id) === String(dbProd._id)
    );
    if (!found) {
      console.log(`UNMATCHED: [${dbProd._id}] ${dbProd.name} (${dbProd.category})`);
      unmatched++;
    } else {
      // console.log(`MATCHED: ${dbProd.name}`);
    }
  });

  console.log(`Total unmatched: ${unmatched}`);
  await mongoose.disconnect();
}

run().catch(console.error);

