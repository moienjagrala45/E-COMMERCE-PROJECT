const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const newFashionProducts = [
  {
    name: "HRX Men's Purple & White Streetwear Casual Sneakers",
    brand: "HRX by Hrithik Roshan",
    category: "Fashion & Apparel",
    price: 2699,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/800/1070/xif0q/shoe/u/5/p/6-hrxwpk44703-6-hrx-by-hrithik-roshan-purple-original-imahjzrppy5gzjtp.jpeg?q=80",
    description: "Elevate your streetwear aesthetic with these HRX by Hrithik Roshan dual-tone casual sneakers. Designed with a clean white and lavender-purple paneled synthetic leather upper, they feature ventilated micro-perforations on the toe box, a padded collar with soft grey lining, and the signature 'HRX Lifestyle 13' woven tongue patch. The thick cushioned rubber cupsole and treaded purple outsole provide all-day shock absorption and stable grip for city walking.",
    specs: {
      "Brand": "HRX by Hrithik Roshan",
      "Model": "HRXWPK44703",
      "Footwear Type": "Low-Top Casual Sneakers",
      "Color": "White & Lavender Purple",
      "Upper Material": "Durable Synthetic Leather with Perforated Toe Box",
      "Sole Material": "Cushioned Rubber / TPR Cupsole with Textured Tread",
      "Closure": "Lace-Up with Flat White Cotton Laces",
      "Available Sizes": "UK 6, UK 7, UK 8, UK 9, UK 10",
      "Occasion": "Casual Streetwear & Daily Lifestyle"
    }
  },
  {
    name: "Rodeiz Men's Lavender Checked Long-Sleeve Casual Shirt",
    brand: "Rodeiz",
    category: "Fashion & Apparel",
    price: 749,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/shirt/f/i/m/m-chk-006-levandar-e-rodeiz-original-imahq5pcnjahvjzz.jpeg?q=90",
    description: "Refine your smart-casual wardrobe with the Rodeiz Men's Checked Casual Shirt. Tailored in a dusty lavender base with crisp white windowpane grid checks, this versatile shirt features a spread collar, a full front button placket with white buttons, long sleeves with buttoned cuffs, and a gently curved hemline. Perfect for layering over a plain white tee or wearing buttoned up for casual workplace and evening outings.",
    specs: {
      "Brand": "Rodeiz",
      "Model": "M-CHK-006",
      "Collar": "Spread / Turndown Collar",
      "Pattern": "Windowpane Grid Check Plaid",
      "Color": "Dusty Lavender & White",
      "Sleeve Length": "Full Sleeves with Button Cuffs",
      "Fit": "Regular Casual Fit with Curved Hemline",
      "Available Sizes": "S, M, L, XL, XXL",
      "Occasion": "Smart Casual & Weekend Wear"
    }
  },
  {
    name: "Hirpara Men's Luxury Octagonal Bezel Analog Watch",
    brand: "Hirpara",
    category: "Fashion & Apparel",
    price: 1699,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/watch/2/p/q/1-st-sl-lv-04-analog-watch-for-men-hirpara-men-original-imahphs883fxt794.jpeg?q=90",
    description: "Make an impression with the Hirpara Luxury Octagonal Bezel Wristwatch. Inspired by iconic Swiss sports watch silhouettes, it features a brushed silver-tone octagonal bezel with polished beveled chamfers surrounding an embossed horizontal-lined plum-purple dial. Equipped with luminous baton hour markers, silver hands, a practical date display at 3 o'clock, and an integrated stainless steel link bracelet with a secure fold-over deployment clasp.",
    specs: {
      "Brand": "Hirpara",
      "Model": "ST-SL-LV-04",
      "Display Type": "Analog Quartz Movement",
      "Dial Color": "Textured Plum Purple with Horizontal Embossing",
      "Bezel & Case": "Brushed Silver-Tone Octagonal Alloy Bezel",
      "Functions": "Hours, Minutes, Sweeping Seconds & Date Window at 3 O'clock",
      "Indices": "Luminous Baton Markers with Minute Track",
      "Strap": "Integrated Brushed Stainless Steel Link Bracelet",
      "Clasp": "Fold-Over Deployment Clasp"
    }
  },
  {
    name: "Shyam Clothing Men's Casual Lavender Pullover Hoodie",
    brand: "Shyam Clothing",
    category: "Fashion & Apparel",
    price: 1099,
    stock: 5,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/sweatshirt/t/o/y/xl-plain-hoodie-with-purple-colour-men-s-shyamclothing-original-imahrsjpjvhfdrgk.jpeg?q=90",
    description: "Stay comfortable and effortlessly stylish with this casual pullover hoodie from Shyam Clothing. Rendered in a soothing pastel lavender-purple shade, it is designed with a relaxed drop-shoulder cut, a spacious double-layered hood with contrasting black flat drawstrings, a roomy kangaroo pouch pocket, and snug ribbed cuffs and hem to lock in warmth on breezy days.",
    specs: {
      "Brand": "Shyam Clothing",
      "Style": "Pullover Hoodie Sweatshirt",
      "Color": "Pastel Lavender / Light Purple",
      "Fit": "Relaxed Drop-Shoulder Casual Fit",
      "Hood Details": "Double-Layered Hood with Black Drawstrings & Metal Eyelets",
      "Pockets": "Front Kangaroo Pocket",
      "Sleeve & Hem": "Full Sleeves with Ribbed Cuffs and Elasticated Hem",
      "Available Sizes": "S, M, L, XL, XXL",
      "Occasion": "Loungewear, Streetwear & Everyday Casual"
    }
  },
  {
    name: "Glamzy Mini Elegance Purple Structured Satchel Handbag",
    brand: "Glamzy",
    category: "Fashion & Apparel",
    price: 899,
    stock: 1,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/hand-messenger-bag/4/8/3/mini-elegance-handbag-7-k-p-mini-purple008-pouch-potli-glamzy-12-resized-original-imahzghsekqqtade.jpeg?q=90",
    description: "Add a touch of sophistication to your ensemble with the Glamzy Mini Elegance Handbag. Sculpted from premium textured vegan PU leather in an exquisite royal purple finish, this structured mini satchel features elegant vertical strap overlays, dual rounded top carrying handles, gold-toned metallic hardware with embossed brand lettering, and a stable flat base designed to stand upright.",
    specs: {
      "Brand": "Glamzy",
      "Model": "Mini-Purple008",
      "Bag Type": "Mini Structured Satchel / Handbag",
      "Color": "Deep Royal Purple / Amethyst",
      "Material": "Textured Vegan PU Leather with Micro-Grain Finish",
      "Handles": "Dual Rigid Curved Top Carry Handles with Gold Rivets",
      "Hardware": "Polished Gold-Tone Handle Rings & Gold Brand Lettering",
      "Base": "Flat Reinforced Base for Freestanding Stability",
      "Occasion": "Parties, Formal Dinners & Evening Gatherings"
    }
  },
  {
    name: "Provogue Men's Day-Date Series Navy Blue Dial Analog Watch",
    brand: "Provogue",
    category: "Fashion & Apparel",
    price: 1399,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/watch/3/6/0/1-pg-2013-provogue-men-watermarked-original-imah3hktneycgnk8.jpeg?q=90",
    description: "The Provogue PG-2013 Analog Watch blends executive precision with active sports appeal. Featuring a bold navy blue sunray dial adorned with silver-tone Roman numeral hour markers at XII and VI, it houses an integrated dual Day and Date calendar complication at 3 o'clock. Enclosed in a polished silver alloy case with ergonomic crown guards, it is paired with a durable matte navy blue silicone sports strap.",
    specs: {
      "Brand": "Provogue",
      "Model": "PG-2013",
      "Series": "Day and Date Series",
      "Display Type": "3-Hand Analog Quartz Movement",
      "Dial Color": "Navy Blue with Sunray Finish",
      "Hour Markers": "Silver Roman Numerals (XII, VI) & Baton Indices",
      "Functions": "Dual Day & Date Calendar Window at 3 O'clock",
      "Case": "Polished Silver-Tone Metal Case with Integrated Crown Guard",
      "Strap Material": "Durable Matte Navy Blue Flexible Silicone / Resin Strap",
      "Clasp": "Stainless Steel Tang Buckle"
    }
  },
  {
    name: "HRX by Hrithik Roshan Ankle Socks (Pack of 3 Pairs)",
    brand: "HRX by Hrithik Roshan",
    category: "Fashion & Apparel",
    price: 349,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/sock/m/4/w/free-3-hrx23114-hrx-original-imahd5wfsrghjvqv.jpeg?q=90",
    description: "Power through daily workouts and everyday routines with this 3-pack of athletic ankle socks from HRX by Hrithik Roshan. Knit in an active stretch cotton blend, each pair features reinforced heel and toe cushioning for blister resistance, arch support bands for stability, and breathable ribbed ankle cuffs embroidered with the HRX insignia. Comes in three versatile heathered tones: Navy Blue, Melange Grey, and Charcoal Black.",
    specs: {
      "Brand": "HRX by Hrithik Roshan",
      "Model": "HRX23114",
      "Pack Contents": "3 Pairs of Athletic Socks (Pack of 3)",
      "Colors Included": "1x Navy Blue with Grey, 1x Heather Grey, 1x Charcoal Black",
      "Sock Length": "Ankle / Low-Cut Sport Length",
      "Cuff": "Ribbed Elasticated Non-Slip Cuff with Knitted HRX Logo",
      "Reinforcement": "Cushioned Terry Sole, Heel & Toe Protection",
      "Size": "Free Size (Unisex Stretchable Fit)",
      "Activity": "Running, Gym, Sports & Everyday Footwear"
    }
  },
  {
    name: "HRX Women's Blush Pink Suede Fleece Walking Shoes",
    brand: "HRX by Hrithik Roshan",
    category: "Fashion & Apparel",
    price: 2199,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/shoe/k/w/a/7-hrxcs356-40-hrx-by-hrithik-roshan-pink-original-imahpmz6rdyzzzvf.jpeg?q=90",
    description: "Experience walking comfort with the HRX Women's Suede Casual Shoes. Styled with a vintage track silhouette in a soft dusty blush-pink faux suede upper, they feature clean off-white racing side stripes, a low-profile gum rubber sole with heel wrap-up for driving comfort, and a plush fleece-lined collar that keeps your ankles cozy and warm throughout the day.",
    specs: {
      "Brand": "HRX by Hrithik Roshan",
      "Model": "HRXCS356",
      "Footwear Type": "Women's Casual Retro Walking Shoes",
      "Color": "Blush Pink & Off-White",
      "Upper Material": "Soft Faux Suede with Stitched Toe Overlay",
      "Inner Lining": "Plush Sherpa Fleece Collar & Tongue Lining",
      "Sole Material": "Flexible Low-Profile Gum Rubber Sole with Heel Bumper",
      "Closure": "Traditional Front Lace-Up with Flat White Laces",
      "Available Sizes": "UK 4, UK 5, UK 6, UK 7"
    }
  },
  {
    name: "Nexbelt Men's Vegan Leather Ratchet Dress Belt with Gold Panther Buckle",
    brand: "Nexbelt",
    category: "Fashion & Apparel",
    price: 599,
    stock: 5,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/belt/e/w/2/one-size-vegan-leather-belt-01-belt-for-men-nexbelt-original-imahzuf9hzke8uag.jpeg?q=90",
    description: "Upgrade your formal attire with this Nexbelt Men's Ratchet Dress Belt. Crafted from textured black vegan PU leather, it eliminates unsightly belt holes with an innovative hidden track ratchet system that allows 1/4-inch micro-adjustments for an exact fit. The centerpiece is a polished rectangular black buckle bordered in gold and highlighted by an embossed 3D sculptural golden leaping panther.",
    specs: {
      "Brand": "Nexbelt",
      "Model": "Vegan Leather Belt 01",
      "Belt Mechanism": "Automatic Ratchet Track (Hole-Less Micro-Adjustable System)",
      "Strap Material": "High-Grade Textured Vegan PU Leather",
      "Color": "Matte Black Strap with Rich Brown Underside",
      "Buckle": "Black Gloss Face with Polished Gold Border & 3D Panther Emblem",
      "Closure": "Quick-Release Lever on Buckle Side",
      "Size": "One Size (Trim-to-Fit Strap Fits Waist Sizes up to 44 Inches)",
      "Style": "Formal Dress & Business Casual"
    }
  },
  {
    name: "BNK Nexus Women's Plaid Long-Sleeve Shirt & Crop Cami 2-Piece Set",
    brand: "BNK Nexus",
    category: "Fashion & Apparel",
    price: 1249,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/shirt/v/z/x/s-women-trending-black-pink-check-combo-shirt-bnk-nexus-resized-original-imahz2sedpgpdybm.jpeg?q=90",
    description: "Embrace versatile layered styling with this BNK Nexus 2-piece coordinated outfit set. The set features a relaxed-fit long-sleeve plaid overshirt with a spread collar and button cuffs, paired with a matching square-neck smocked crop camisole top finished with a playful ruffled peplum hemline. Wear the pieces together for a coordinated casual look or mix and match with high-waisted denim and skirts.",
    specs: {
      "Brand": "BNK Nexus",
      "Set Includes": "2-Piece Set (1x Long-Sleeve Plaid Overshirt + 1x Smocked Crop Cami)",
      "Pattern": "Classic Windowpane Tartan Plaid",
      "Color Options": "Black & White Tartan / Dusty Rose Pink Tartan",
      "Overshirt Details": "Button-Down Front Placket, Spread Collar, Long Sleeves",
      "Cami Details": "Square Neckline, Elastic Smocked Bodice & Frilled Peplum Hem",
      "Fit": "Regular Relaxed Fit",
      "Available Sizes": "S, M, L, XL",
      "Occasion": "Casual Outings, College & Layered Streetwear"
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB successfully");

  const Product = require('../models/Product');
  const Order = require('../models/Order');

  // 1. Deactivate previous active fashion products so historical orders are preserved
  const deactivationResult = await Product.updateMany(
    { category: { $regex: /fashion/i }, isVisible: { $ne: false } },
    { $set: { isVisible: false } }
  );
  console.log(`Deactivated ${deactivationResult.modifiedCount} previous active fashion products in MongoDB.`);

  // 2. Insert exactly the 10 new fashion products
  const inserted = await Product.insertMany(newFashionProducts);
  console.log(`Successfully inserted exactly ${inserted.length} new Fashion & Apparel products into MongoDB.`);

  // 3. Verify total active products per category
  const activeLaptops = await Product.find({
    category: { $regex: /laptop/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Laptops in DB: ${activeLaptops.length}`);

  const activePhones = await Product.find({
    category: { $regex: /phone/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Phones in DB: ${activePhones.length}`);

  const activeAccessories = await Product.find({
    category: { $regex: /accessor/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Accessories in DB: ${activeAccessories.length}`);

  const activeFashion = await Product.find({
    category: { $regex: /fashion/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Fashion & Apparel in DB: ${activeFashion.length}`);

  const totalActive = await Product.countDocuments({ isVisible: { $ne: false } });
  console.log(`Total Active Products in DB: ${totalActive} (Expected: 12 + 12 + 12 + 10 = 46)`);

  // 4. Verify historical orders intact
  const orders = await Order.find({});
  console.log(`Verified ${orders.length} historical orders remain intact.`);

  // 5. Synchronize frontend productsData.js
  const allActiveProducts = await Product.find({ isVisible: { $ne: false } }).lean();

  const frontendDataContent = `/**
 * ShopEase Verified Ultra-Premium Catalog
 * Exactly 4 Categories:
 * 1. Laptops (12 products)
 * 2. Phones (12 products)
 * 3. Accessories (12 products)
 * 4. Fashion & Apparel (10 products)
 * Total Active Products: 46
 *
 * High-resolution authentic photography on neutral backgrounds.
 */

export const EXISTING_STORE_PRODUCTS = ${JSON.stringify(allActiveProducts.map(p => ({
    _id: String(p._id),
    name: p.name,
    brand: p.brand || "ShopEase Flagship",
    category: p.category,
    price: p.price,
    stock: p.stock,
    isVisible: p.isVisible !== false,
    image: p.image,
    shortDescription: p.description || "",
    description: p.description || "",
    specs: p.specs || {}
  })), null, 2)};

export function enrichProduct(p) {
  if (!p) return null;
  const image = p.image || p.imageUrl || (Array.isArray(p.images) ? p.images[0] : "");
  return {
    ...p,
    image,
    imageUrl: image,
    description: p.description || p.shortDescription || "",
    shortDescription: p.shortDescription || p.description || "",
    specs: p.specs || {}
  };
}
`;

  const frontendFilePath = path.join(__dirname, '../../frontend/src/data/productsData.js');
  fs.writeFileSync(frontendFilePath, frontendDataContent, 'utf8');
  console.log(`Synchronized ${allActiveProducts.length} active products to ${frontendFilePath}`);

  console.log("\n================ 10 NEW FASHION & APPAREL SUMMARY ================");
  activeFashion.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p._id}] ${p.name} | ₹${p.price} | Stock: ${p.stock} | Brand: ${p.brand}`);
  });

  await mongoose.disconnect();
  console.log("Migration complete!");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});

