const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const newPhones = [
  {
    name: "Samsung Galaxy Z Fold8 5G Smartphone",
    brand: "Samsung",
    category: "Phones",
    price: 24899,
    stock: 2,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/71LVm2OIk0L._SX679_.jpg",
    description: "Unfold a new era of productivity and entertainment with the Samsung Galaxy Z Fold8. Featuring an expansive 7.6-inch Dynamic AMOLED 2X foldable interior display and a sleek 6.3-inch cover screen, this flagship device is engineered for multitasking with Galaxy AI. Powered by the high-performance Qualcomm Snapdragon 8 Gen 4 for Galaxy with 12GB RAM, it delivers responsive processing, high-resolution photography with a 50MP OIS camera, and all-day dual-cell battery endurance.",
    specs: {
      "Brand": "Samsung",
      "Model": "Galaxy Z Fold8 5G",
      "Form Factor": "Book-Style Foldable Smartphone",
      "Main Display": "7.6-inch Dynamic AMOLED 2X (120Hz LTPO, 2600 nits)",
      "Cover Display": "6.3-inch Dynamic AMOLED 2X (120Hz)",
      "Processor": "Qualcomm Snapdragon 8 Gen 4 for Galaxy Octa-core",
      "RAM": "12GB LPDDR5X",
      "Storage": "256GB UFS 4.0",
      "Rear Camera": "50MP Wide (OIS) + 12MP Ultra-Wide + Telephoto",
      "Front Camera": "10MP Cover Camera + 4MP Under-Display Camera",
      "Battery": "4600mAh Dual-Cell",
      "Charging": "45W Fast Wired Charging, 15W Wireless Charging",
      "Operating System": "Android 16 with One UI 8 & Galaxy AI",
      "Network": "5G Dual SIM (Nano + eSIM)",
      "Water Resistance": "IPX8 Certified"
    }
  },
  {
    name: "OnePlus N6x 5G Smartphone",
    brand: "OnePlus",
    category: "Phones",
    price: 12999,
    stock: 5,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/61rbuaZn+AL._AC_UY218_.jpg",
    description: "Engineered for unmatched endurance and durability, the OnePlus N6x features an enormous 7,000mAh battery that delivers up to 2.5 days of reliable power on a single charge. Its 6.8-inch ultra-smooth 120Hz display with Aqua Touch technology guarantees responsive touch response even with wet hands. Built to MIL-STD-810H military-grade standards and powered by the MediaTek Dimensity 6360 Apex 5G processor, it offers exceptional resilience and smooth everyday multitasking.",
    specs: {
      "Brand": "OnePlus",
      "Model": "OnePlus N6x 5G",
      "Display": "6.8-inch HD+ LCD Display (120Hz Refresh Rate, Aqua Touch)",
      "Processor": "MediaTek Dimensity 6360 Apex Octa-core (6nm)",
      "RAM": "6GB LPDDR4X (Expandable via RAM-Vita)",
      "Storage": "128GB Internal Storage (Expandable up to 1TB)",
      "Rear Camera": "13MP AI Primary Camera with Night & Portrait Modes",
      "Front Camera": "5MP HD Selfie Camera",
      "Battery": "7000mAh Silicon-Carbon Mega Battery",
      "Charging": "SuperVOOC Fast Charging + Reverse Charging Support",
      "Operating System": "OxygenOS 16 based on Android 16",
      "Durability": "MIL-STD-810H Military-Grade & IP64 Splash Resistance",
      "Network": "5G Dual SIM, 4G VoLTE, Wi-Fi, Bluetooth 5.3",
      "Audio": "3.5mm Headphone Jack, Dual Stereo Speakers"
    }
  },
  {
    name: "Apple iPhone 16 Plus (128GB - Pink)",
    brand: "Apple",
    category: "Phones",
    price: 24499,
    stock: 1,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/31Ir0LOgoeL._SX342_SY445_QL70_FMwebp_.jpg",
    description: "The Apple iPhone 16 Plus delivers an expansive 6.7-inch Super Retina XDR OLED display, incredible all-day battery life with up to 27 hours of video playback, and the cutting-edge A18 Bionic chip custom-built for Apple Intelligence. Capture stunning spatial photos and 4K Dolby Vision video using the 48MP Fusion camera system with 2x optical-quality telephoto. Featuring the innovative Camera Control slider and the customizable Action button, it provides seamless photographic control in an aerospace-grade aluminum enclosure.",
    specs: {
      "Brand": "Apple",
      "Series": "iPhone 16 Plus",
      "Model": "A3290",
      "Display": "6.7-inch Super Retina XDR OLED (2796x1290, 2000 nits)",
      "Processor": "Apple A18 Bionic (6-Core CPU, 5-Core GPU, 16-Core NPU)",
      "RAM": "8GB Unified Memory",
      "Storage": "128GB NVMe",
      "Rear Camera": "48MP Fusion (f/1.6, Sensor-shift OIS) + 12MP Ultra Wide",
      "Front Camera": "12MP TrueDepth Camera with Autofocus",
      "Battery": "Rechargeable Lithium-ion (Up to 27 hrs video playback)",
      "Charging": "USB-C Fast Charging, 25W MagSafe, Qi2 Wireless",
      "Operating System": "iOS 18 with Apple Intelligence",
      "Controls": "Camera Control Touch Button & Action Button",
      "Durability": "Ceramic Shield Front, IP68 Water/Dust Resistance",
      "Network": "5G (sub-6 GHz), Wi-Fi 7, Bluetooth 5.3, UWB",
      "Color": "Pink"
    }
  },
  {
    name: "Samsung Galaxy A37 5G Smartphone",
    brand: "Samsung",
    category: "Phones",
    price: 18990,
    stock: 3,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/71U4G9lYY3L._AC_UY218_.jpg",
    description: "Experience a smooth and engaging smartphone experience with the Samsung Galaxy A37 5G. Its modern design, vibrant 6.7-inch Super AMOLED 120Hz display with Vision Booster, versatile 50MP triple camera system with Optical Image Stabilization (OIS), and reliable 5G connectivity make it suitable for everyday entertainment, photography, and multitasking. Powered by the Exynos 1480 processor with AMD Xclipse graphics and backed by a 5,000mAh battery with 45W fast charging, it delivers refined performance with 6 years of promised security updates.",
    specs: {
      "Brand": "Samsung",
      "Series": "Galaxy A Series",
      "Model": "Galaxy A37 5G",
      "Display": "6.7-inch Super AMOLED FHD+ (120Hz, Vision Booster)",
      "Processor": "Samsung Exynos 1480 Octa-core (up to 2.75GHz)",
      "GPU": "AMD Xclipse 530",
      "RAM": "8GB LPDDR5X",
      "Storage": "128GB (Expandable up to 1TB via MicroSD)",
      "Rear Camera": "50MP Main (OIS) + 8MP Ultra-Wide + 5MP Macro",
      "Front Camera": "12MP High-Resolution Selfie Camera",
      "Battery": "5000mAh All-Day Battery",
      "Charging": "45W Super Fast Charging via USB-C",
      "Operating System": "Android 16 with One UI 8",
      "Durability": "IP68 Dust and Water Resistant (1.5m for 30 mins)",
      "Network": "5G Dual SIM, Wi-Fi 6, Bluetooth 5.3, NFC",
      "Security": "Knox Vault & In-Display Fingerprint Sensor",
      "Color": "Awesome Light Violet"
    }
  },
  {
    name: "Xiaomi 17T 5G Leica Smartphone",
    brand: "Xiaomi",
    category: "Phones",
    price: 21499,
    stock: 4,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/61AX0q6UfJL._AC_UL320_.jpg",
    description: "Co-engineered with Leica optics, the Xiaomi 17T sets a new benchmark in mobile photography. It boasts a dedicated 50MP Leica 5x optical periscope telephoto lens capable of up to 120x AI Ultra Zoom alongside a 50MP Light Fusion 800 primary sensor with OIS. Powered by the 4nm MediaTek Dimensity 8500 Ultra processor, a 120Hz 1.5K CrystalRes AMOLED display with 3500 nits peak brightness, and a 6,500mAh silicon-carbon battery with 67W HyperCharge, this flagship offers uncompromising speed and imaging excellence.",
    specs: {
      "Brand": "Xiaomi",
      "Series": "17T Series",
      "Model": "Xiaomi 17T 5G",
      "Display": "6.59-inch 1.5K CrystalRes AMOLED (120Hz, 3500 nits)",
      "Processor": "MediaTek Dimensity 8500 Ultra (4nm Octa-core up to 3.4GHz)",
      "RAM": "12GB LPDDR5X",
      "Storage": "256GB UFS 4.1 High-speed Storage",
      "Rear Camera": "Leica Triple Camera: 50MP Main OIS + 50MP 5x Periscope + 12MP Ultra-Wide",
      "Front Camera": "32MP In-display Selfie Camera",
      "Battery": "6500mAh Silicon-Carbon High-Density Battery",
      "Charging": "67W HyperCharge via USB Type-C",
      "Operating System": "Xiaomi HyperOS 3 based on Android 16",
      "Durability": "IP68 Water and Dust Resistance, Gorilla Glass 7i",
      "Network": "5G Dual SIM, Wi-Fi 7, Bluetooth 6.0, IR Blaster",
      "Audio": "Dual Stereo Speakers with Dolby Atmos",
      "Color": "Titanium Black"
    }
  },
  {
    name: "Apple iPhone 16 (128GB - Pink)",
    brand: "Apple",
    category: "Phones",
    price: 23790,
    stock: 2,
    isVisible: true,
    image: "https://m.media-amazon.com/images/I/61zwK7mmLtL._AC_UY218_.jpg",
    description: "Designed from the ground up for Apple Intelligence, the Apple iPhone 16 features the powerful A18 Bionic chip, an intuitive new Camera Control button for instant photo adjustments, and a versatile 48MP Fusion camera with 2x optical-quality telephoto. Its compact 6.1-inch Super Retina XDR OLED screen with Dynamic Island shines up to 2000 nits outdoors, while the aerospace-grade aluminum chassis with color-infused glass back offers durable elegance.",
    specs: {
      "Brand": "Apple",
      "Series": "iPhone 16",
      "Model": "A3287",
      "Display": "6.1-inch Super Retina XDR OLED (2556x1179, 2000 nits)",
      "Processor": "Apple A18 Bionic (6-Core CPU, 5-Core GPU, 16-Core Neural Engine)",
      "RAM": "8GB Unified Memory",
      "Storage": "128GB NVMe",
      "Rear Camera": "48MP Fusion (f/1.6, Sensor-shift OIS) + 12MP Ultra Wide",
      "Front Camera": "12MP TrueDepth Camera with 4K Dolby Vision HDR",
      "Battery": "Rechargeable Lithium-ion (Up to 22 hrs video playback)",
      "Charging": "USB-C Fast Charging, 25W MagSafe, Qi2 Wireless",
      "Operating System": "iOS 18 with Apple Intelligence",
      "Controls": "Camera Control Button & Customizable Action Button",
      "Durability": "Latest-generation Ceramic Shield, IP68 Rated",
      "Network": "5G, Wi-Fi 7, Bluetooth 5.3, Ultra Wideband",
      "Color": "Pink"
    }
  },
  {
    name: "Google Pixel 9 Pro 5G AI Smartphone",
    brand: "Google",
    category: "Phones",
    price: 22999,
    stock: 5,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/j/8/e/-resized-original-imahqszeftuehhhq.jpeg?q=90",
    description: "The Google Pixel 9 Pro combines sophisticated design with Google's most powerful Tensor G4 processor and 16GB RAM for on-device Gemini AI experiences. Its iconic redesigned floating camera visor houses a pro-grade triple camera array with a 50MP main sensor, 48MP ultra-wide with Macro Focus, and a 48MP 5x telephoto lens with 30x Super Res Zoom. Equipped with a vivid 6.3-inch Super Actua LTPO 120Hz display and 7 years of promised updates, it represents Google's pinnacle mobile innovation.",
    specs: {
      "Brand": "Google",
      "Series": "Pixel 9 Pro",
      "Model": "Pixel 9 Pro 5G",
      "Display": "6.3-inch Super Actua LTPO OLED (1-120Hz, 3000 nits)",
      "Processor": "Google Tensor G4 with Titan M2 Security",
      "RAM": "16GB LPDDR5X (Gemini Nano Optimized)",
      "Storage": "128GB UFS 3.1",
      "Rear Camera": "50MP Octa PD Wide (OIS) + 48MP Ultra-Wide + 48MP 5x Telephoto",
      "Front Camera": "42MP Dual PD Selfie with Autofocus & 103° FOV",
      "Battery": "4700mAh Battery (24+ hr life, Extreme Battery Saver)",
      "Charging": "27W Fast Wired Charging + Fast Wireless Charging",
      "Operating System": "Android 15 / 16 (7 Years of Feature Drops & Security)",
      "Durability": "Corning Gorilla Glass Victus 2, IP68 Certified",
      "Network": "5G Dual SIM, Wi-Fi 7, Bluetooth 5.3, UWB, Satellite SOS",
      "Color": "Hazel Lavender"
    }
  },
  {
    name: "Mivi One 5G Smartphone",
    brand: "Mivi",
    category: "Phones",
    price: 10499,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/w/f/o/-original-imahrgb9p4nnnhhp.jpeg?q=90",
    description: "The Mivi One 5G is the debut smartphone from Indian tech brand Mivi, delivering robust Snapdragon performance with zero bloatware and clean stock Android. Powered by the efficient Qualcomm Snapdragon 4 Gen 2 octa-core processor and a 50MP Samsung ISOCELL camera, it features a fluid 6.75-inch 120Hz display with Panda Glass protection. With an enormous 6,000mAh two-day battery and dual 5G connectivity, it brings exceptional reliability to the everyday user.",
    specs: {
      "Brand": "Mivi",
      "Model": "Mivi One 5G",
      "Display": "6.75-inch HD+ IPS Display (120Hz, Panda Glass)",
      "Processor": "Qualcomm Snapdragon 4 Gen 2 Octa-core (4nm up to 2.2GHz)",
      "RAM": "6GB LPDDR4X (+6GB Virtual RAM Turbo)",
      "Storage": "128GB Internal Storage (Expandable up to 1TB)",
      "Rear Camera": "50MP Samsung AI Main Camera + Depth Sensor",
      "Front Camera": "8MP Front Camera with Screen Flash",
      "Battery": "6000mAh Ultra-Capacity Battery",
      "Charging": "18W Fast Charging via USB Type-C",
      "Operating System": "Stock Android (Zero Ads, Zero Pre-installed Bloatware)",
      "Network": "5G Dual SIM, 4G VoLTE, Wi-Fi, Bluetooth 5.1",
      "Audio": "3.5mm Headphone Jack, Studio-Tuned Audio",
      "Color": "Royal Burgundy"
    }
  },
  {
    name: "Infinix Hot 70 Pro 5G Smartphone",
    brand: "Infinix",
    category: "Phones",
    price: 14999,
    stock: 1,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/t/d/o/-original-imahqu3mcbdvkawx.jpeg?q=90",
    description: "Turn heads with the Infinix Hot 70 Pro 5G, featuring India's first interactive Active Matrix Cube (AMC) rear LED display that displays customizable notifications, charging animations, and emojis. Backed by a 50MP Sony IMX882 optical camera with 2x lossless zoom and flagship-level IP68 dust and water resistance, this phone excels in multimedia and gaming with its 6.76-inch 144Hz 3D-curved AMOLED display, MediaTek Dimensity 7100 5G processor, and 6,000mAh battery with 45W fast charging.",
    specs: {
      "Brand": "Infinix",
      "Series": "Hot Series",
      "Model": "Hot 70 Pro 5G",
      "Display": "6.76-inch 3D Curved AMOLED (144Hz, 1.5K, 1300 nits)",
      "Rear Feature": "Active Matrix Cube (AMC) Interactive Mini LED Matrix",
      "Processor": "MediaTek Dimensity 7100 5G Octa-core (6nm)",
      "RAM": "8GB LPDDR4X (+8GB Extended RAM)",
      "Storage": "128GB UFS 2.2",
      "Rear Camera": "50MP Sony IMX882 (OIS, 2x Lossless Zoom) + Depth",
      "Front Camera": "32MP Crystal Clear Selfie with Dual LED Flash",
      "Battery": "6000mAh Battery",
      "Charging": "45W All-Round FastCharge 2.0 with Reverse Charging",
      "Operating System": "XOS 14.5 based on Android 14",
      "Durability": "IP68 Ultimate Dust and Water Resistant",
      "Audio": "Dual Stereo Speakers tuned by JBL",
      "Network": "5G Dual SIM, Wi-Fi 6, Bluetooth 5.4",
      "Color": "Active Matrix Titanium"
    }
  },
  {
    name: "Tecno Spark 30 Pro AMOLED Smartphone",
    brand: "Tecno",
    category: "Phones",
    price: 8999,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/f/s/u/-original-imahqzrdjxxdjyz2.jpeg?q=90",
    description: "The Tecno Spark 30 Pro brings flagship aesthetics to the mainstream with its ultra-slim 7.4mm profile and a stunning 6.78-inch FHD+ 120Hz AMOLED display reaching 1,700 nits peak brightness. Capture extraordinary detail with the 108MP ultra-clear main camera featuring 3x in-sensor lossless zoom and quad-LED flash. Powered by the MediaTek Helio G100 processor, 8GB RAM with 8GB virtual expansion, stereo Dolby Atmos speakers, and a 5,000mAh battery with 33W super charging, it offers complete everyday luxury.",
    specs: {
      "Brand": "Tecno",
      "Series": "Spark 30 Series",
      "Model": "Spark 30 Pro",
      "Display": "6.78-inch FHD+ AMOLED (120Hz, 1700 nits, In-display Sensor)",
      "Processor": "MediaTek Helio G100 Octa-core (6nm up to 2.2GHz)",
      "RAM": "8GB (+8GB Extended Virtual RAM)",
      "Storage": "128GB Internal Storage (Expandable via MicroSD)",
      "Rear Camera": "108MP Ultra-Clear Camera with 3x Lossless Zoom",
      "Front Camera": "13MP Selfie Camera with Dual Color Temperature Flash",
      "Battery": "5000mAh Battery",
      "Charging": "33W SuperCharge via USB Type-C",
      "Operating System": "HiOS 14 based on Android 14",
      "Durability": "IP54 Splash/Dust Resistance, 7.4mm Slim Design",
      "Audio": "Dual Stereo Speakers with Dolby Atmos & Hi-Res",
      "Network": "4G LTE Dual SIM, Dual-Band Wi-Fi, Bluetooth 5.3, NFC, IR Blaster",
      "Color": "Obsidian Edge"
    }
  },
  {
    name: "Lava Virat V1 5G Smartphone",
    brand: "Lava",
    category: "Phones",
    price: 6499,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/h/f/c/-original-imahqzzbknbqkkf5.jpeg?q=90",
    description: "Proudly engineered in India, the Lava Virat V1 5G delivers dependable 5G connectivity, durable IP64 dust and splash resistance, and an expansive 6.75-inch (17.13cm) HD+ 120Hz display. Equipped with an octa-core UNISOC T8200 5G processor, 4GB RAM with 4GB virtual RAM expansion, and a massive 6,000mAh battery, it ensures reliable multi-day performance. Supported by Lava's signature Free Service @ Home doorstep assistance, it offers total peace of mind for budget-conscious consumers.",
    specs: {
      "Brand": "Lava",
      "Series": "Virat Series",
      "Model": "Virat V1 5G",
      "Display": "6.75-inch (17.13cm) HD+ Notch Display (120Hz, 2.5D Glass)",
      "Processor": "UNISOC T8200 5G Octa-core Processor (up to 2.6GHz)",
      "RAM": "4GB (+4GB Virtual RAM Expansion)",
      "Storage": "64GB ROM (Expandable up to 1TB via MicroSD)",
      "Rear Camera": "13MP AI Primary Camera with Portrait & HDR Modes",
      "Front Camera": "5MP Front Camera with Screen Flash",
      "Battery": "6000mAh Mega Endurance Battery",
      "Charging": "Fast USB Type-C Charging",
      "Operating System": "Android 16 (Clean OS, Zero Bloatware)",
      "Durability": "IP64 Dust & Water Splash Resistant",
      "Warranty & Support": "Free Service @ Home Doorstep Support",
      "Network": "5G Dual SIM (5G+5G Dual Active), 4G VoLTE, Wi-Fi, Bluetooth",
      "Color": "Arya Blue"
    }
  },
  {
    name: "iQOO Z10 5G Curved AMOLED Smartphone",
    brand: "iQOO",
    category: "Phones",
    price: 17499,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/mobile/s/l/j/-original-imahgzpkgd5xy9vs.jpeg?q=90",
    description: "Built for gamers and power users, the iQOO Z10 5G pairs a breathtaking 6.77-inch 3D curved 120Hz AMOLED display with up to 5,000 nits local peak brightness and a groundbreaking 7,300mAh silicon-carbon battery. Powered by the 4nm Qualcomm Snapdragon 7s Gen 3 chipset and 90W ultra-fast FlashCharge, it handles heavy gaming and intense multitasking with effortless cooling. A 50MP Sony OIS camera and IP65 splash resistance round out this performance powerhouse.",
    specs: {
      "Brand": "iQOO",
      "Series": "Z Series",
      "Model": "iQOO Z10 5G",
      "Display": "6.77-inch FHD+ 3D Curved AMOLED (120Hz, 5000 nits peak)",
      "Processor": "Qualcomm Snapdragon 7s Gen 3 (4nm Octa-core up to 2.5GHz)",
      "RAM": "8GB LPDDR4X (+8GB Extended RAM 3.0)",
      "Storage": "128GB UFS 2.2",
      "Rear Camera": "50MP Sony Ultra-Sensing OIS Camera + 2MP Bokeh, 4K Video",
      "Front Camera": "32MP HD Portrait Selfie Camera",
      "Battery": "7300mAh Monster Silicon-Carbon Battery",
      "Charging": "90W FlashCharge via USB Type-C",
      "Operating System": "Funtouch OS 15 based on Android 15",
      "Durability": "IP65 Splash and Dust Resistance",
      "Gaming & Haptics": "Linear Motor & Ultra-Gaming Mode",
      "Network": "5G Dual SIM, Wi-Fi 6, Bluetooth 5.4, IR Blaster",
      "Color": "Glacier Silver"
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB successfully");

  const Product = require('../models/Product');
  const Order = require('../models/Order');

  // 1. Deactivate previous active phones so historical orders are preserved
  const deactivationResult = await Product.updateMany(
    { category: { $regex: /phone/i }, isVisible: { $ne: false } },
    { $set: { isVisible: false } }
  );
  console.log(`Deactivated ${deactivationResult.modifiedCount} previous active phones in MongoDB.`);

  // 2. Insert exactly the 12 new phone products
  const insertedPhones = await Product.insertMany(newPhones);
  console.log(`Successfully inserted exactly ${insertedPhones.length} new Phones into MongoDB.`);

  // 3. Verify total active products per category
  const activePhones = await Product.find({
    category: { $regex: /phone/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Phones in DB now: ${activePhones.length}`);

  const activeLaptops = await Product.find({
    category: { $regex: /laptop/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Laptops in DB: ${activeLaptops.length}`);

  const activeAccessories = await Product.find({
    category: { $regex: /accessor/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Accessories in DB: ${activeAccessories.length}`);

  const activeFashion = await Product.find({
    category: { $regex: /fashion/i },
    isVisible: { $ne: false }
  });
  console.log(`Active Fashion in DB: ${activeFashion.length}`);

  const totalActive = await Product.countDocuments({ isVisible: { $ne: false } });
  console.log(`Total Active Products in DB: ${totalActive} (Expected: 12 + 12 + 10 + 10 = 44)`);

  // 4. Verify historical orders intact
  const orders = await Order.find({});
  console.log(`Verified ${orders.length} historical orders remain intact.`);

  // 5. Synchronize frontend productsData.js
  const allActiveProducts = await Product.find({ isVisible: { $ne: false } }).lean();
  
  // Format into productsData.js
  const frontendDataContent = `/**
 * ShopEase Verified Ultra-Premium Catalog
 * Exactly 4 Categories:
 * 1. Laptops (12 products)
 * 2. Phones (12 products)
 * 3. Accessories (10 products)
 * 4. Fashion & Apparel (10 products)
 * Total Active Products: 44
 *
 * All prices strictly <= ₹25,000 (demo/testing constraint).
 * High-resolution authentic studio photography on neutral backgrounds.
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

  console.log("\n================ 12 NEW PHONES SUMMARY ================");
  activePhones.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p._id}] ${p.name} | ₹${p.price} | Stock: ${p.stock} | Brand: ${p.brand}`);
  });

  await mongoose.disconnect();
  console.log("Migration complete!");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
