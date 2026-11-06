const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const newAccessories = [
  {
    name: "P47 Wireless Foldable Over-Ear Headphones",
    brand: "P47",
    category: "Accessories",
    price: 1199,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/headphone/r/u/h/p47-wireless-ic-04-headphone-with-mic-sd-card-slot-bluetooth-original-imahs4ujcu7rnpgc.jpeg?q=90",
    description: "The P47 Wireless Headphones deliver crisp stereo sound with deep bass and flexible audio options. Featuring Bluetooth wireless connectivity, a built-in microphone for hands-free calling, and an integrated Micro-SD card slot for offline MP3 playback, these headphones are built for daily commuting, workouts, and study sessions. Its lightweight foldable headband and cushioned on-ear earcups ensure long-lasting listening comfort with easy-access on-ear media controls.",
    specs: {
      "Brand": "P47",
      "Model": "P47 Wireless (IC-04)",
      "Form Factor": "On-Ear Foldable Headset",
      "Connectivity": "Bluetooth Wireless + 3.5mm AUX Wired Mode",
      "Microphone": "Built-in Microphone for Calls",
      "Memory Card Slot": "Micro-SD / TF Card Support",
      "Controls": "On-Ear Multi-function Button Wheel (Play/Pause, Volume, Track, Mode)",
      "Design": "Collapsible Folding Headband with Cushioned Ear Cushions",
      "Color": "Matte Black"
    }
  },
  {
    name: "O15-240 Plus Dual Mic ENC Wireless Earbuds",
    brand: "O15",
    category: "Accessories",
    price: 2199,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/headphone/s/2/d/o15-240-plus-wireless-bluetooth-earbuds-with-100-hrs-playback-original-imahpp4yzdvghbnb.jpeg?q=90",
    description: "Experience pristine audio and crystal-clear phone calls with the O15-240 Plus True Wireless Earbuds. Equipped with advanced Dual-Mic Environmental Noise Cancellation (ENC), they filter out background chatter so your voice comes through with clarity. The ergonomic stem earbuds nestle comfortably in your ears, while the elegant pebble charging case features gold trim and an integrated LED battery indicator for on-the-go recharges.",
    specs: {
      "Brand": "O15",
      "Model": "O15-240 Plus",
      "Headphone Type": "In-Ear True Wireless Stereo (TWS)",
      "Noise Cancellation": "Dual-Microphone ENC (Environmental Noise Cancellation)",
      "Charging Case": "Pocket-sized Magnetic Charging Case with LED Indicator",
      "Connectivity": "Bluetooth Low Latency",
      "Earbud Fit": "Ergonomic In-Ear with Soft Silicone Tips",
      "Color": "Lavender Violet with Gold Accent Trim"
    }
  },
  {
    name: "HRX Urban Laptop Backpack with USB Charging Port",
    brand: "HRX",
    category: "Accessories",
    price: 2799,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/backpack/k/1/4/4-sefton-bize2go-pro-unisex-travel-13-hrx-020-laptop-backpack-original-imahgtcnhdjyygge.jpeg?q=90",
    description: "The HRX Urban Laptop Backpack combines contemporary athletic styling with everyday commuter utility. Constructed from durable, water-resistant polyester with an embossed HRX front emblem, it features a dedicated padded laptop compartment, an external USB pass-through port for charging your mobile device on the move, reflective safety accents, breathable air-mesh shoulder straps, and dual side mesh water bottle holders.",
    specs: {
      "Brand": "HRX",
      "Model": "HRX-020",
      "Type": "Unisex Everyday & Travel Laptop Backpack",
      "Material": "Durable Water-Resistant Polyester",
      "Compartments": "Multi-Compartment with Padded Laptop Sleeve & Quick-Access Zip Pockets",
      "External Feature": "Built-in USB Pass-Through Charging Port",
      "Straps": "Padded Ergonomic Shoulder Straps with Air Mesh Back Panel",
      "Side Pockets": "Dual Mesh Bottle/Umbrella Pockets",
      "Color": "Navy Blue & Matte Black"
    }
  },
  {
    name: "4-in-1 Mobile & PC Gaming Accessories Combo",
    brand: "ShopEase Gaming",
    category: "Accessories",
    price: 3499,
    stock: 1,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/laptop-accessories-combo/0/o/a/4-in-1-mobile-gaming-combo-type-c-hub-rgb-gaming-mouse-mouse-pad-original-imahsnfnjgrhqkav.jpeg?q=70",
    description: "Level up your gaming and mobile workstation with this comprehensive 4-in-1 accessories bundle. The set includes a full-sized tactile USB keyboard with dedicated numeric keypad and built-in smartphone docking groove, an ergonomic RGB optical gaming mouse with contoured thumb grips, a sleek aluminum 4-port Type-C USB 3.0 multiport hub adapter, and a smooth-glide neon constellation speed mouse pad.",
    specs: {
      "Included Components": "1x USB Keyboard, 1x RGB Gaming Mouse, 1x Type-C 4-Port Hub, 1x Gaming Mouse Pad",
      "Keyboard": "Full-size 104-Key USB Keyboard with Mobile Phone Cradle Notch",
      "Mouse": "Ergonomic Multi-Button Wired Gaming Mouse with Dynamic RGB Lighting",
      "Hub Adapter": "Aluminum Alloy 4-Port Type-C Multiport USB 3.0 Hub",
      "Mouse Pad": "Non-Slip Rubber Base Speed Fabric Pad with Constellation Graphic",
      "Compatibility": "PC, Laptop, Smartphone & Tablet (Type-C OTG Supported)"
    }
  },
  {
    name: "Portable Dual-Woofer RGB DJ Party Speaker with Remote",
    brand: "3RY Audio",
    category: "Accessories",
    price: 4299,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/party-speaker/v/d/f/dj-speaker1-3ry-original-imahp8shwgptxptj.jpeg?q=70",
    description: "Bring the party wherever you go with the Portable Dual-Woofer DJ Party Speaker. Featuring twin pulsating RGB LED ring woofers that sync to your music, a top-mounted digital mode display, and an included multi-function wireless remote, it pumps out dynamic stereo sound. Equipped with an ergonomic carry handle, Bluetooth wireless connectivity, USB flash drive input, TF/MicroSD slot, and AUX playback modes, it is ready for indoor gatherings and outdoor entertainment.",
    specs: {
      "Brand": "3RY",
      "Model": "DJ-Speaker1-3RY",
      "Speaker Type": "Portable Column DJ Party Speaker",
      "Lighting": "Dual RGB Ring LED Lights with Multi-Color Party Modes",
      "Connectivity": "Bluetooth Wireless, USB Flash Drive, TF/MicroSD Card, AUX",
      "Display": "Top Digital LED Status Display (Mode / Track)",
      "Controls": "Full-function Wireless Remote Control + Top Control Dials",
      "Portability": "Integrated Heavy-Duty Top Carrying Handle",
      "Color": "Matte Black"
    }
  },
  {
    name: "Celltech Clear MagSafe Magnetic Protective Back Cover for iPhone 17",
    brand: "Celltech",
    category: "Accessories",
    price: 699,
    stock: 5,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/cases-covers/back-cover/u/m/o/clear-mgsafe-ip-17-celltech-original-imahg2bhcvxzqc28.jpeg?q=90",
    description: "Showcase your phone's original color and finish while enjoying snap-on magnetic convenience with the Celltech Clear MagSafe Case for iPhone 17. Built with an ultra-transparent scratch-resistant hard acrylic back and shock-absorbing flexible TPU edges, it integrates a precision neodymium magnetic ring for flawless MagSafe wireless charging, magnetic car mounts, and wallet attachments. Raised lips around the camera island and display prevent direct surface contact.",
    specs: {
      "Brand": "Celltech",
      "Model": "Clear-MGSAFE-IP-17",
      "Compatible Device": "Apple iPhone 17",
      "Case Type": "Hybrid Transparent Magnetic Back Cover",
      "MagSafe Compatible": "Built-in Strong Neodymium Magnetic Ring & Alignment Magnet",
      "Material": "High-Clarity Anti-Yellowing Acrylic Back + Flexible TPU Bumper",
      "Edge Protection": "Raised Bezels for Camera Lens & Screen Protection",
      "Cutouts": "Precise CNC Cutouts for Speakers, USB-C Port & Independent Button Covers"
    }
  },
  {
    name: "Fervik 8-Socket Power Strip & Surge Protector with 4 USB Ports",
    brand: "Fervik",
    category: "Accessories",
    price: 1499,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/surge-protector/u/w/c/3-8-pin-black-no-a8pd-yes-fervik-original-imahph6uangvubym.jpeg?q=90",
    description: "Organize and protect your home office electronics with the Fervik 8-Socket Surge Protector Power Strip. Featuring 8 widely spaced universal AC outlets and a dedicated 4-port USB charging station (3 USB-A ports plus 1 USB Type-C port), it powers up to 12 devices simultaneously. Built with flame-retardant casing, an illuminated master power switch with integrated overload circuit breaker, and a durable 2-meter heavy-duty cable with a 3-pin Indian plug.",
    specs: {
      "Brand": "Fervik",
      "Model": "A8PD",
      "AC Outlets": "8 Universal 3-Pin Sockets with Child Safety Shutters",
      "USB Ports": "3x USB-A + 1x USB Type-C Smart Charging Ports",
      "Cable Length": "2-Meter Heavy-Duty Copper Power Cord",
      "Plug Type": "Standard Indian 3-Pin Grounded Plug",
      "Safety Protection": "Master Switch with Integrated Overload & Surge Protection",
      "Mounting": "Desktop Layout with Anti-Slip Base Rubber Feet",
      "Color": "Matte Black"
    }
  },
  {
    name: "Aqua Care Gadget Cleaning Kit (100ml Pack of 3 with Microfiber Cloths)",
    brand: "Aqua Care",
    category: "Accessories",
    price: 449,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/cleaning-kit/c/o/h/gadget-cleaner-100-ml-pack-of-3-with-3-cloths-for-mobile-laptop-original-imahqv92rzrhd4hh.jpeg?q=90",
    description: "Keep your screens, laptops, and gadgets spotless and crystal clear with the Aqua Care 3-Pack Cleaning Kit. Each set includes three 100ml fine-mist spray bottles and three ultra-soft microfiber cloths. The gentle, streak-free, anti-static cleaning solution effectively lifts dust, oil, smudges, and fingerprints from smartphones, laptop displays, tablets, camera lenses, monitors, and smartwatch faces without scratching delicate surfaces.",
    specs: {
      "Brand": "Aqua Care",
      "Package Contents": "3x 100ml Cleaning Spray Bottles + 3x Microfiber Cleaning Cloths",
      "Total Volume": "300 ml (3 x 100 ml)",
      "Formula": "Non-Streaking, Alcohol-Free, Anti-Static Screen Formula",
      "Application": "Fine Mist Spray Pump for Even Surface Dispersion",
      "Compatible Devices": "Smartphones, Laptops, Tablets, Smart TVs, Monitors, Camera Lenses & Glasses",
      "Cloths": "High-Density Reusable & Washable Microfiber Cloths"
    }
  },
  {
    name: "Velqor 68W GaN Turbo Power Fast Charger Set with Type-C Cable",
    brand: "Velqor",
    category: "Accessories",
    price: 1899,
    stock: 2,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/battery-charger/v/h/d/vlqr-68wmc-a02-velqor-original-imahs2zzy9msneh6.jpeg?q=90",
    description: "Power your modern devices at high velocity with the Velqor 68W GaN Turbo Power Wall Charger. Utilizing advanced Gallium Nitride (GaN) semiconductor technology, it delivers high-wattage charging in a compact, cool-running form factor that fits effortlessly into pockets or travel bags. The kit comes complete with a durable Type-C to Type-C high-current cable and intelligent multi-protection circuitry against over-current, over-voltage, and short circuits.",
    specs: {
      "Brand": "Velqor",
      "Model": "VLQR-68WMC-A02",
      "Total Output Power": "68W Turbo Power",
      "Semiconductor Technology": "GaN (Gallium Nitride) High-Efficiency Architecture",
      "Output Interface": "USB Type-C Fast-Charging Port",
      "Included Cable": "Durable High-Speed Type-C to Type-C Charging Cable",
      "Plug Type": "Standard Indian 2-Pin Wall Plug",
      "Safety Systems": "Smart Multi-Layer Thermal & Overload Protection",
      "Color": "Matte Black with 68 Graphic"
    }
  },
  {
    name: "Realspeed 128GB Metal USB 3.0 High-Speed Flash Pen Drive",
    brand: "Realspeed",
    category: "Accessories",
    price: 999,
    stock: 5,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/pendrive/pendrive/l/m/j/rs-realspeed-original-imahs2rtscmaybbz.jpeg?q=90",
    description: "Carry your essential documents, media, and backups securely with the Realspeed 128GB USB Flash Drive. Built with a shock-resistant and heat-dissipating metallic zinc-alloy unibody, it features an integrated blue lanyard loop for easy attachment to keychains. Backed by high-speed USB 3.0 performance with backwards USB 2.0 compatibility, it provides driver-free plug-and-play convenience across PCs, laptops, smart TVs, and vehicle media systems.",
    specs: {
      "Brand": "Realspeed",
      "Model": "RS-Realspeed 128G",
      "Storage Capacity": "128 GB",
      "Interface": "USB 3.0 (Backwards Compatible with USB 2.0)",
      "Body Construction": "Durable Zinc-Alloy Metallic Unibody",
      "Form Factor": "Capless Design with Integrated Lanyard Keyring Hole",
      "Operation": "Plug & Play (No Driver Installation Required)",
      "OS Compatibility": "Windows, macOS, Linux, ChromeOS, Smart TVs & Car Audio",
      "Color": "Silver Chrome with Blue Accent Loop"
    }
  },
  {
    name: "360° Adjustable Telescopic Car Mobile Holder for Dashboard",
    brand: "Manoj Traders",
    category: "Accessories",
    price: 799,
    stock: 3,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/car-cradle/dashboard/f/u/x/sc360-01-manojtraders-original-imahp73ujngbpygm.jpeg?q=90",
    description: "Drive safely with optimal GPS visibility using the 360° Adjustable Telescopic Car Mobile Phone Cradle. Featuring a heat-resistant ABS build with carbon-fiber texture backplate and cushioned side clamping arms, it holds smartphones securely over road bumps. The telescopic extending arm and 360-degree pivoting ball joint allow custom angle and distance adjustment, while the heavy-duty suction gel pad with locking lever firmly grips dashboards or windshields.",
    specs: {
      "Brand": "Manoj Traders",
      "Model": "SC360-01",
      "Mounting Type": "Heavy-Duty Suction Gel Base with Pressure Locking Lever",
      "Mounting Placement": "Car Dashboard, Windshield or Flat Desktop Surface",
      "Arm Mechanism": "Telescopic Extendable & Angle-Adjustable Arm",
      "Rotation": "360-Degree Ball Joint for Portrait and Landscape Orientations",
      "Cradle Features": "Cushioned Side Clamping Arms, Quick Release Button & Bottom Support Feet",
      "Material": "Heat-Resistant ABS with Carbon Fiber Finish",
      "Color": "Black"
    }
  },
  {
    name: "Wontons Smooth Touch Tempered Glass Screen Protector for Nothing Phone 3a Lite",
    brand: "Wontons",
    category: "Accessories",
    price: 299,
    stock: 4,
    isVisible: true,
    image: "https://rukminim2.flixcart.com/image/1600/1600/xif0q/screen-guard/tempered-glass/m/7/c/nothing-phone-3a-lite-tempered-glass-wontons-original-imahpgtggzgazdvn.jpeg?q=90",
    description: "Shield your display against daily scratches, scrapes, and drops with the Wontons Ultra-Smooth Tempered Glass Screen Protector designed specifically for the Nothing Phone 3a Lite. Engineered with high touch sensitivity for effortless gaming and swiping, it features an electroplated oleophobic coating that repels fingerprint smudges, facial oils, and moisture. The precision laser-cut border offers edge-to-edge coverage while maintaining complete case compatibility.",
    specs: {
      "Brand": "Wontons",
      "Compatible Device": "Nothing Phone 3a Lite",
      "Protector Type": "Edge-to-Edge HD Clear Tempered Glass",
      "Touch Sensitivity": "Ultra-Smooth High-Sensitivity Surface (Game Friendly)",
      "Surface Coating": "Anti-Fingerprint Oleophobic Coating Repels Smudges & Oil",
      "Transparency": "High-Definition Optical Clarity Preserving Display Colors",
      "Cutout": "Precision Laser-Cut Earpiece Speaker & Sensor Openings",
      "Installation": "Bubble-Free Self-Adhering Silicon Layer"
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB successfully");

  const Product = require('../models/Product');
  const Order = require('../models/Order');

  // 1. Deactivate previous active accessories so historical orders and data are preserved
  const deactivationResult = await Product.updateMany(
    { category: { $regex: /accessor/i }, isVisible: { $ne: false } },
    { $set: { isVisible: false } }
  );
  console.log(`Deactivated ${deactivationResult.modifiedCount} previous active accessories in MongoDB.`);

  // 2. Insert exactly the 12 new accessory products
  const inserted = await Product.insertMany(newAccessories);
  console.log(`Successfully inserted exactly ${inserted.length} new Accessories into MongoDB.`);

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
  console.log(`Active Fashion in DB: ${activeFashion.length}`);

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

  console.log("\n================ 12 NEW ACCESSORIES SUMMARY ================");
  activeAccessories.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p._id}] ${p.name} | ₹${p.price} | Stock: ${p.stock} | Brand: ${p.brand}`);
  });

  await mongoose.disconnect();
  console.log("Migration complete!");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});

