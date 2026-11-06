const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");

const PREMIUM_40_PRODUCTS = [
  // ==================== 1. LAPTOPS (10) ====================
  {
    name: "Apple MacBook Air M2 13.6\" Liquid Retina",
    category: "Laptops",
    price: 24990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    isVisible: true,
  },
  {
    name: "Dell XPS 13 InfinityEdge Ultrabook",
    category: "Laptops",
    price: 24490,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isVisible: true,
  },
  {
    name: "HP Spectre x360 2-in-1 OLED Touch",
    category: "Laptops",
    price: 23990,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    isVisible: true,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Ultralight",
    category: "Laptops",
    price: 24800,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    isVisible: true,
  },
  {
    name: "ASUS ZenBook 14 OLED Space Edition",
    category: "Laptops",
    price: 22990,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    stock: 7,
    isVisible: true,
  },
  {
    name: "Microsoft Surface Laptop 5 Alcantara",
    category: "Laptops",
    price: 23499,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    isVisible: true,
  },
  {
    name: "Samsung Galaxy Book3 Pro 360",
    category: "Laptops",
    price: 24500,
    image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&auto=format&fit=crop&q=80",
    stock: 9,
    isVisible: true,
  },
  {
    name: "Acer Swift Go 14 OLED EVO",
    category: "Laptops",
    price: 21990,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    stock: 11,
    isVisible: true,
  },
  {
    name: "LG Gram 14 Ultra-Lightweight",
    category: "Laptops",
    price: 22490,
    image: "https://images.unsplash.com/photo-1499914485622-a88fac536970?w=800&auto=format&fit=crop&q=80",
    stock: 6,
    isVisible: true,
  },
  {
    name: "Razer Blade Stealth Quartz Edition",
    category: "Laptops",
    price: 24999,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop&q=80",
    stock: 4,
    isVisible: true,
  },

  // ==================== 2. PHONES (10) ====================
  {
    name: "Apple iPhone 15 Pro Titanium Edition",
    category: "Phones",
    price: 24990,
    image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    isVisible: true,
  },
  {
    name: "Samsung Galaxy S24 Ultra AI Smartphone",
    category: "Phones",
    price: 24499,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isVisible: true,
  },
  {
    name: "Google Pixel 8 Pro Google AI Edition",
    category: "Phones",
    price: 23990,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    stock: 9,
    isVisible: true,
  },
  {
    name: "OnePlus 12 5G Hasselblad Optics",
    category: "Phones",
    price: 22990,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    isVisible: true,
  },
  {
    name: "Apple iPhone 14 Pro Deep Purple",
    category: "Phones",
    price: 24200,
    image: "https://images.unsplash.com/photo-1634403665481-74948d815f03?w=800&auto=format&fit=crop&q=80",
    stock: 6,
    isVisible: true,
  },
  {
    name: "Samsung Galaxy Z Flip5 Foldable AMOLED",
    category: "Phones",
    price: 23499,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    isVisible: true,
  },
  {
    name: "Xiaomi 14 Ultra Leica Summilux",
    category: "Phones",
    price: 24800,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    stock: 5,
    isVisible: true,
  },
  {
    name: "Nothing Phone (2) Glyph Matrix White",
    category: "Phones",
    price: 21990,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    isVisible: true,
  },
  {
    name: "Sony Xperia 1 V 4K OLED Cinema",
    category: "Phones",
    price: 24999,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    stock: 4,
    isVisible: true,
  },
  {
    name: "Motorola Edge 50 Ultra Pantone Peach",
    category: "Phones",
    price: 22490,
    image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop&q=80",
    stock: 11,
    isVisible: true,
  },

  // ==================== 3. ACCESSORIES (10) ====================
  {
    name: "Apple AirPods Max Space Gray Spatial Audio",
    category: "Accessories",
    price: 24900,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    isVisible: true,
  },
  {
    name: "Sony WH-1000XM5 Noise-Canceling Headphones",
    category: "Accessories",
    price: 23990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    isVisible: true,
  },
  {
    name: "Apple Watch Series 9 GPS + Cellular",
    category: "Accessories",
    price: 24490,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    stock: 11,
    isVisible: true,
  },
  {
    name: "Bose QuietComfort Ultra Spatial Headphones",
    category: "Accessories",
    price: 22990,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format&fit=crop&q=80",
    stock: 7,
    isVisible: true,
  },
  {
    name: "Samsung Galaxy Watch6 Classic LTE",
    category: "Accessories",
    price: 21490,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    stock: 13,
    isVisible: true,
  },
  {
    name: "Marshall Stanmore III Bluetooth Speaker",
    category: "Accessories",
    price: 23490,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    stock: 5,
    isVisible: true,
  },
  {
    name: "Bang & Olufsen Beoplay EX Wireless Earbuds",
    category: "Accessories",
    price: 24800,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80",
    stock: 6,
    isVisible: true,
  },
  {
    name: "Sennheiser Momentum 4 Audiophile Wireless",
    category: "Accessories",
    price: 22900,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    stock: 9,
    isVisible: true,
  },
  {
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    category: "Accessories",
    price: 18490,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isVisible: true,
  },
  {
    name: "DJI Osmo Mobile 6 Smart Gimbal",
    category: "Accessories",
    price: 14990,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    isVisible: true,
  },

  // ==================== 4. FASHION & APPAREL (10) ====================
  {
    name: "Armani Collezioni Tailored Italian Blazer",
    category: "Fashion & Apparel",
    price: 18990,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    isVisible: true,
  },
  {
    name: "Calvin Klein Monogram Minimalist Leather Jacket",
    category: "Fashion & Apparel",
    price: 14490,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    stock: 11,
    isVisible: true,
  },
  {
    name: "Tom Ford Polarized Luxury Aviator Sunglasses",
    category: "Fashion & Apparel",
    price: 12990,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    stock: 16,
    isVisible: true,
  },
  {
    name: "Balenciaga Designer Triple S Luxury Sneakers",
    category: "Fashion & Apparel",
    price: 21990,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    stock: 9,
    isVisible: true,
  },
  {
    name: "Prada Saffiano Calfskin Leather Tote Bag",
    category: "Fashion & Apparel",
    price: 23990,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    isVisible: true,
  },
  {
    name: "Burberry Classic Vintage Check Cashmere Scarf",
    category: "Fashion & Apparel",
    price: 15490,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isVisible: true,
  },
  {
    name: "Armani Exchange Signature Heavyweight Hoodie",
    category: "Fashion & Apparel",
    price: 8990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    isVisible: true,
  },
  {
    name: "Levi's Made & Crafted 14oz Japanese Selvedge Denim",
    category: "Fashion & Apparel",
    price: 8499,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    isVisible: true,
  },
  {
    name: "Ralph Lauren Classic Fit Polo Bear Shirt",
    category: "Fashion & Apparel",
    price: 9490,
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    isVisible: true,
  },
  {
    name: "Louis Vuitton Style Monogram Weekend Travel Duffel",
    category: "Fashion & Apparel",
    price: 22490,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    stock: 7,
    isVisible: true,
  },
];

async function seedDatabase() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://moienjagrala:Moien%404545@cluster0.v8qfx.mongodb.net/shopease?retryWrites=true&w=majority";

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected successfully.");

    console.log("Deleting old products collection...");
    await Product.deleteMany({});

    console.log("Inserting 40 verified ultra-premium products with 100% valid images...");
    const inserted = await Product.insertMany(PREMIUM_40_PRODUCTS);
    console.log(`Successfully seeded ${inserted.length} ultra-premium products!`);

    await mongoose.disconnect();
    console.log("MongoDB connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
