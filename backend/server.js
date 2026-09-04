const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");


// ================= ENV =================

dotenv.config();


// ================= DATABASE =================

connectDB();


// ================= EXPRESS =================

const app = express();


// ================= MIDDLEWARE =================

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "ShopEase Backend is Running!",
  });
});


// ================= PRODUCT ROUTES =================

app.use(
  "/api/products",
  productRoutes
);


// ================= USER ROUTES =================

app.use(
  "/api/users",
  userRoutes
);


// ================= CART ROUTES =================

app.use(
  "/api/cart",
  cartRoutes
);


// ================= ORDER ROUTES =================

app.use(
  "/api/orders",
  orderRoutes
);


// ================= ADMIN ROUTES =================

app.use(
  "/api/admin",
  adminRoutes
);


// ================= SERVER START =================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Local backend: http://localhost:${PORT}`
    );

    console.log(
      `Network backend: http://192.168.0.101:${PORT}`
    );
  }
);