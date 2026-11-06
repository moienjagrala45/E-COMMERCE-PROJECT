const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  const Product = require('../models/Product');

  // 1. Fix LG gram Pro image URL in DB
  const cleanLgUrl = "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/65e1c356-1d8a-4793-b05f-15f5d04a76d9/Laptops_17Z90TR-E-AAB4U1_gallery_1_new_5000x5000";
  const lgUpdate = await Product.updateOne(
    { name: { $regex: /LG gram Pro/i } },
    { $set: { image: cleanLgUrl } }
  );
  console.log(`Updated LG image in DB: modifiedCount = ${lgUpdate.modifiedCount}`);

  // 2. Fetch all active products from DB
  const dbProducts = await Product.find({ isVisible: { $ne: false } });
  console.log(`Found ${dbProducts.length} active products in DB.`);

  // 3. Read frontend productsData.js
  const productsDataPath = path.join(__dirname, '../../frontend/src/data/productsData.js');
  const { EXISTING_STORE_PRODUCTS } = await import('file:///' + productsDataPath.replace(/\\/g, '/'));

  // Update DB records for non-laptops with brand, description, and specs
  for (const dbP of dbProducts) {
    const staticP = EXISTING_STORE_PRODUCTS.find(p =>
      p.name?.trim().toLowerCase() === dbP.name?.trim().toLowerCase() ||
      String(p._id) === String(dbP._id)
    );

    if (staticP) {
      const updates = {};
      if (!dbP.brand && staticP.brand) updates.brand = staticP.brand;
      if (!dbP.description && (staticP.description || staticP.shortDescription)) {
        updates.description = staticP.description || staticP.shortDescription;
      }
      if ((!dbP.specs || Object.keys(dbP.specs).length === 0) && staticP.specs) {
        updates.specs = staticP.specs;
      }
      if (Object.keys(updates).length > 0) {
        await Product.updateOne({ _id: dbP._id }, { $set: updates });
        console.log(`Enriched DB product [${dbP._id}] ${dbP.name}`);
      }
    }
  }

  // 4. Update productsData.js to use real MongoDB _ids for all 42 products and clean LG url
  const updatedCatalog = EXISTING_STORE_PRODUCTS.map(staticP => {
    const dbMatch = dbProducts.find(dbP =>
      dbP.name?.trim().toLowerCase() === staticP.name?.trim().toLowerCase() ||
      String(dbP._id) === String(staticP._id)
    );

    const updated = {
      ...staticP,
      _id: dbMatch ? dbMatch._id.toString() : staticP._id,
      brand: staticP.brand || dbMatch?.brand || "ShopEase Flagship",
      shortDescription: staticP.shortDescription || staticP.description || dbMatch?.description || "",
      specs: staticP.specs || dbMatch?.specs || {}
    };

    if (updated.name?.includes("LG gram Pro")) {
      updated.image = cleanLgUrl;
    }

    return updated;
  });

  // Re-write productsData.js cleanly
  const fileContent = `/**
 * ShopEase Verified Ultra-Premium Catalog
 * Exactly 4 Categories:
 * 1. Laptops (12 products)
 * 2. Phones (10 products)
 * 3. Accessories (10 products)
 * 4. Fashion & Apparel (10 products)
 *
 * All prices strictly <= ₹25,000 (payment testing constraint).
 * High-resolution authentic studio photography on neutral backgrounds.
 */

export const EXISTING_STORE_PRODUCTS = ${JSON.stringify(updatedCatalog, null, 2)};

/**
 * Enriches product data with fallback specs and detailed brand information
 */
export function enrichProduct(product) {
  if (!product) return product;

  const found = EXISTING_STORE_PRODUCTS.find(
    (p) =>
      String(p._id) === String(product._id || product.id) ||
      p.name?.trim().toLowerCase() === product.name?.trim().toLowerCase()
  );

  const resolvedImage =
    (typeof product.image === "string" && product.image.trim()) ||
    (typeof product.imageUrl === "string" && product.imageUrl.trim()) ||
    (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0].trim()) ||
    found?.image ||
    "";

  return {
    ...product,
    _id: product._id || product.id || found?._id,
    image: resolvedImage,
    brand: product.brand || found?.brand || "ShopEase Flagship",
    description:
      product.description ||
      product.shortDescription ||
      found?.description ||
      found?.shortDescription ||
      \`Official certified \${product.name}. Inspected for authentic craftsmanship, pristine condition, and full warranty support.\`,
    shortDescription:
      product.shortDescription ||
      product.description ||
      found?.shortDescription ||
      found?.description ||
      \`Official certified \${product.name}.\`,
    specs:
      product.specs && Object.keys(product.specs).length > 0
        ? product.specs
        : found?.specs || {
            Brand: product.brand || found?.brand || "ShopEase Verified",
            Category: product.category || "Flagship",
            Condition: "Brand New Sealed In Box",
            Warranty: "1-Year Official Brand Warranty",
          },
  };
}
`;

  fs.writeFileSync(productsDataPath, fileContent);
  console.log("Successfully updated frontend/src/data/productsData.js with real MongoDB IDs and helper");

  await mongoose.disconnect();
}

run().catch(console.error);
