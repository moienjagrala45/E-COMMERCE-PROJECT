const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");

async function restockAll() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Product.updateMany(
    {},
    {
      $set: {
        stock: 100,
        isVisible: true,
      },
    }
  );

  console.log(`Successfully updated ${result.modifiedCount} products.`);

  const products = await Product.find({});
  console.log("\nCurrent Inventory:");
  products.forEach((p) => {
    console.log(`- ${p.name}: Stock = ${p.stock} (₹${p.price})`);
  });

  await mongoose.connection.close();
  console.log("\nDone!");
}

restockAll().catch(console.error);
