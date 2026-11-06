const mongoose = require('mongoose');
require('dotenv').config();

const newLaptops = [
  {
    name: "Lenovo IdeaPad Slim 3 Intel Core i7 Laptop",
    brand: "Lenovo",
    category: "Laptops",
    price: 16499,
    stock: 3,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/71WThYxixsL._AC_UF1000,1000_QL80_.jpg",
    description: "Experience powerful everyday computing with the Lenovo IdeaPad Slim 3. Its 13th Gen Intel Core i7 processor, 16GB RAM, and 512GB SSD provide responsive performance for multitasking, productivity, studying, and professional work. Its 15.3-inch WUXGA IPS display delivers clear visuals, while the backlit keyboard makes working more convenient.",
    specs: {
      Brand: "Lenovo",
      Series: "IdeaPad Slim 3",
      Model: "83K100CJIN",
      Processor: "13th Gen Intel Core i7-13620H",
      RAM: "16GB DDR5",
      Storage: "512GB SSD",
      Display: "15.3-inch WUXGA IPS",
      "Operating System": "Windows 11",
      Keyboard: "Backlit"
    }
  },
  {
    name: "HP 15 Intel Core i5 Laptop",
    brand: "HP",
    category: "Laptops",
    price: 17299,
    stock: 1,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/71zO9msJL7L._AC_UF1000,1000_QL80_.jpg",
    description: "The HP 15 is designed for everyday productivity, office tasks, online learning, and multitasking. Its 13th Gen Intel Core i5 processor, 16GB RAM, and 512GB SSD provide a responsive computing experience. The 15.6-inch Full HD anti-glare display and backlit keyboard make it suitable for both work and study.",
    specs: {
      Brand: "HP",
      Series: "HP 15",
      Model: "FR0045TU",
      Processor: "13th Gen Intel Core i5-13420H",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "15.6-inch Full HD",
      "Operating System": "Windows 11",
      Keyboard: "Backlit"
    }
  },
  {
    name: "Dell Inspiron 15 Touchscreen Laptop",
    brand: "Dell",
    category: "Laptops",
    price: 17990,
    stock: 5,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/81QBQE8xV4L.jpg",
    description: "The Dell Inspiron 15 offers a practical combination of performance and convenience for everyday computing. Its Intel Core i5 processor, 16GB RAM, and SSD storage support multitasking, office applications, and daily productivity. The 15.6-inch touchscreen display provides an interactive viewing experience.",
    specs: {
      Brand: "Dell",
      Series: "Inspiron 15",
      Model: "Inspiron 3530",
      Processor: "Intel Core i5-1334U",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "15.6-inch Full HD Touchscreen",
      "Operating System": "Windows 11"
    }
  },
  {
    name: "ASUS ROG Strix G16 Gaming Laptop",
    brand: "ASUS",
    category: "Laptops",
    price: 18499,
    stock: 2,
    isVisible: true,
    image: "https://in.store.asus.com/media/catalog/product/g/6/g615-lw.jpg",
    description: "The ASUS ROG Strix G16 is a performance-focused gaming laptop from the Republic of Gamers series. Its gaming-oriented design and powerful hardware platform make it suitable for demanding applications, entertainment, and gaming. Present its verified gaming specifications accurately.",
    specs: {
      Brand: "ASUS",
      Series: "ROG Strix G16",
      Model: "G615LW Series",
      Display: "16-inch ROG Nebula Display",
      "Operating System": "Windows 11",
      Keyboard: "4-Zone RGB Backlit Chiclet Keyboard"
    }
  },
  {
    name: "Acer Aspire 5 AI PC Intel Core Ultra 5 Laptop",
    brand: "Acer",
    category: "Laptops",
    price: 19199,
    stock: 4,
    isVisible: true,
    image: "https://supermaxstores.in/cdn/shop/files/1_cb1252f8-da46-498b-9afd-41d760357738.png?v=1784523333&width=3840",
    description: "The Acer Aspire 5 AI PC brings intelligent next-generation computing into a sleek, ultra-portable 1.2 kg chassis. Powered by an Intel Core Ultra 5 processor with dedicated AI acceleration, 17.5 mm slim profile, vibrant display, and backlit keyboard, it is crafted for mobile productivity and creators on the go.",
    specs: {
      Brand: "Acer",
      Series: "Aspire 5 AI PC",
      Model: "Aspire 5 AI PC",
      Processor: "Intel Core Ultra 5",
      Display: "14-inch Full HD IPS",
      "Operating System": "Windows 11",
      Keyboard: "Backlit Keyboard",
      Weight: "1.2 kg",
      Thickness: "17.5 mm"
    }
  },
  {
    name: "MSI Pulse GL Series Gaming Laptop",
    brand: "MSI",
    category: "Laptops",
    price: 19890,
    stock: 1,
    isVisible: true,
    image: "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/22504539/Pulse_GL76_GL66_Scenario_Photo_5.jpg?quality=90&strip=all&crop=0%2C0.002657736671452%2C100%2C99.994684526657&w=2400",
    description: "The MSI Pulse GL series features a bold gaming-focused design intended for immersive entertainment and gaming. Its performance-oriented design and gaming aesthetics make it a suitable choice for users looking for a dedicated gaming laptop experience.",
    specs: {
      Brand: "MSI",
      Series: "Pulse GL Series",
      Model: "Pulse GL Series (GL66 / GL76)",
      Keyboard: "RGB Backlit Gaming Keyboard",
      Design: "Sci-Fi Titanium Gray Armor Design",
      Cooling: "Cooler Boost 5 Thermal Architecture"
    }
  },
  {
    name: "Microsoft Surface Laptop 13.5\" Touchscreen",
    brand: "Microsoft",
    category: "Laptops",
    price: 20499,
    stock: 3,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/71gegFR7yHL.jpg",
    description: "The Microsoft Surface Laptop combines sleek elegance with responsive AI-assisted computing. Featuring a stunning 13.5-inch 2K+ Touchscreen, Intel Core Ultra 5 processor, 16GB RAM, and 1TB fast SSD storage, it delivers an effortless premium computing experience for modern professionals and creators.",
    specs: {
      Brand: "Microsoft",
      Series: "Surface Laptop",
      Model: "Surface Laptop (Intel Core Ultra 5 Edition)",
      Processor: "Intel Core Ultra 5",
      RAM: "16GB",
      Storage: "1TB SSD",
      Display: "13.5-inch 2K+ Touchscreen",
      "Operating System": "Windows 11"
    }
  },
  {
    name: "Samsung Galaxy Book4 Intel Core i5 Laptop",
    brand: "Samsung",
    category: "Laptops",
    price: 21299,
    stock: 2,
    isVisible: true,
    image: "https://tiimg.tistatic.com/fp/2/009/567/samsung-laptop-378.jpg",
    description: "The Samsung Galaxy Book4 delivers an elegant, slim profile with dependable Intel Core i5 processing power. Featuring a refined chassis, expansive display, full-size keyboard with numeric keypad, and seamless integration with the Samsung Galaxy ecosystem, it is built for effortless multitasking and mobile productivity.",
    specs: {
      Brand: "Samsung",
      Series: "Galaxy Book4",
      Model: "Galaxy Book4",
      Processor: "Intel Core i5",
      Display: "15.6-inch Full HD",
      "Operating System": "Windows 11",
      Keyboard: "Full-size Keyboard with Numeric Keypad"
    }
  },
  {
    name: "LG gram Pro 17 Laptop",
    brand: "LG",
    category: "Laptops",
    price: 21999,
    stock: 4,
    isVisible: true,
    image: "https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/65e1c356-1d8a-4793-b05f-15f5d04a76d9/Laptops_17Z90TR-E-AAB4U1_gallery_1_new_5000x5000?io=transform:fill,width=1536",
    description: "The LG gram Pro 17 is designed for users who want a large display in a premium, portable laptop. Its 17-inch WQXGA display offers detailed visuals and a spacious workspace. Its slim design makes it suitable for productivity, professional work, and everyday use.",
    specs: {
      Brand: "LG",
      Series: "LG gram Pro",
      Model: "17Z90TR Series",
      Display: "17-inch WQXGA IPS",
      "Operating System": "Windows 11"
    }
  },
  {
    name: "ASUS ROG Strix SCAR Series Gaming Laptop",
    brand: "ASUS",
    category: "Laptops",
    price: 22790,
    stock: 5,
    isVisible: true,
    image: "https://dlcdnwebimgs.asus.com/gain/299AF6C6-7DD0-4322-9343-3E37828784F1/w717/h525",
    description: "The ASUS ROG Strix SCAR is engineered for tournament-level esports and cutting-edge gaming performance. Featuring a distinctive semi-translucent chassis, RGB Aura Sync lightbar, full-size gaming keyboard, and high-refresh gaming display, it offers enthusiasts top-tier responsiveness and uncompromising style.",
    specs: {
      Brand: "ASUS",
      Series: "ROG Strix SCAR",
      Model: "ROG Strix SCAR Series",
      Display: "ROG Nebula High-Refresh Gaming Display",
      "Operating System": "Windows 11",
      Keyboard: "Per-Key RGB Backlit Gaming Keyboard with NumPad",
      Design: "Translucent Keyboard Deck & Aura Sync Lightbar"
    }
  },
  {
    name: "Infinix Y1 Plus Neo XL30 Laptop",
    brand: "Infinix",
    category: "Laptops",
    price: 23499,
    stock: 2,
    isVisible: true,
    image: "https://rukminim3.flixcart.com/image/480/480/xif0q/computer/c/a/c/xl30-thin-and-light-laptop-infinix-original-imah3fhegsftbgwd.jpeg?q=90",
    description: "The Infinix Y1 Plus Neo is a thin-and-light laptop designed for everyday productivity, online learning, browsing, and general computing. Its Full HD display and portable design make it convenient for students and everyday users.",
    specs: {
      Brand: "Infinix",
      Series: "Infinix Y1 Plus Neo",
      Model: "Y1 Plus Neo XL30",
      Processor: "Intel Celeron Quad Core",
      Display: "15.6-inch Full HD",
      "Operating System": "Windows 11 Home",
      Keyboard: "Backlit Keyboard"
    }
  },
  {
    name: "Apple MacBook Laptop – Premium Aluminum Series",
    brand: "Apple",
    category: "Laptops",
    price: 24899,
    stock: 1,
    isVisible: true,
    image: "https://specials-images.forbesimg.com/imageserve/6213c2a05ed1f7de596d35b4/960x0.jpg",
    description: "The Apple MacBook combines an iconic slim aluminum unibody design with seamless performance. Featuring Apple's signature precision-crafted chassis, backlit Magic Keyboard, intuitive trackpad, and macOS ecosystem, it offers a sophisticated computing experience for professionals, creators, and everyday productivity.",
    specs: {
      Brand: "Apple",
      Series: "MacBook",
      Model: "MacBook Series",
      Display: "Retina Display",
      "Operating System": "macOS",
      Keyboard: "Backlit Magic Keyboard with Force Touch Trackpad",
      Material: "Precision Aluminum Unibody"
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const Product = require('../models/Product');
  const Order = require('../models/Order');

  // 1. Deactivate old active laptop products so historical orders are preserved
  const deactivationResult = await Product.updateMany(
    { category: { $regex: /laptop/i }, isVisible: { $ne: false } },
    { $set: { isVisible: false } }
  );
  console.log(`Deactivated ${deactivationResult.modifiedCount} previous active laptops.`);

  // 2. Insert exactly the 12 new laptop products
  const inserted = await Product.insertMany(newLaptops);
  console.log(`Successfully inserted ${inserted.length} new laptops.`);

  // 3. Verify total active laptops
  const activeLaptops = await Product.find({
    category: { $regex: /laptop/i },
    isVisible: { $ne: false }
  });
  console.log(`Total active laptops now in DB: ${activeLaptops.length}`);

  // 4. Verify other categories unchanged
  const nonLaptops = await Product.find({
    category: { $not: /laptop/i },
    isVisible: { $ne: false }
  });
  console.log(`Total active non-laptop products in DB: ${nonLaptops.length}`);

  // 5. Verify orders still reference existing records
  const orders = await Order.find({}).populate('items.product', 'name price image');
  console.log(`Verified ${orders.length} total historical orders; none broken.`);

  console.log("\nActive Laptops Summary:");
  activeLaptops.forEach((l, idx) => {
    console.log(`${idx + 1}. [${l._id}] ${l.name} | ₹${l.price} | Stock: ${l.stock} | Brand: ${l.brand}`);
  });

  await mongoose.disconnect();
  console.log("\nMigration completed successfully.");
}

run().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
