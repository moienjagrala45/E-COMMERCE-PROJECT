import { useContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import "./App.css";

/* ================= CUSTOMER COMPONENTS ================= */

import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Auth from "./components/Auth";
import OrderSuccess from "./components/OrderSuccess";

/* ================= CUSTOMER PAGES ================= */

import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ProductsPage from "./Pages/ProductsPage";

/* ================= ADMIN COMPONENTS ================= */

import AdminProduct from "./components/AdminProduct";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";

/* ================= ADMIN PAGES ================= */

import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/Adminlogin";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";

/* ================= CONTEXT ================= */

import {
  CartContext,
} from "./context/CartContext";


/* =========================================================
   CUSTOMER HOME PAGE
========================================================= */

function Home() {

  const {
    cartItems,
    notification,
  } = useContext(CartContext);


  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const navigate =
    useNavigate();


  const location =
    useLocation();


  useEffect(() => {

    if (
      location.state?.scrollTo ===
      "products"
    ) {

      const productsSection =
        document.getElementById(
          "products"
        );


      productsSection?.scrollIntoView({
        behavior:
          "smooth",
      });

    }

  }, [
    location.state,
  ]);


  /* ================= LOGGED IN USER ================= */

  const savedUser =
    JSON.parse(
      localStorage.getItem("user")
    );


  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const response =
            await fetch(
              "https://e-commerce-project-backend-vpdz.onrender.com/api/products"
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              "Failed to fetch products"
            );

          }


          console.log(
            "Products:",
            data
          );


          setProducts(data);


        } catch (error) {

          console.error(
            "Error fetching products:",
            error
          );


        } finally {

          setLoading(false);

        }
      };


    fetchProducts();


  }, []);


  /* ================= CART TOTAL ITEMS ================= */

  const totalItems =
    cartItems.reduce(
      (total, item) => {

        return (
          total +
          item.quantity
        );

      },
      0
    );


  /* ================= SHOP NOW ================= */

  const goToProducts = () => {
    navigate("/products");
  };


  /* ================= LOGOUT ================= */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );


      navigate(
        "/login"
      );

    };


  return (
    <div className="home-page-container">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          ShopEase
        </div>

        {/* ================= NAV LINKS ================= */}
        <div className="nav-links">
          <a
            href="/home"
            className="nav-link-active"
            onClick={(e) => {
              e.preventDefault();
              navigate("/home");
            }}
          >
            Home
          </a>

          <a
            href="/products"
            onClick={(e) => {
              e.preventDefault();
              navigate("/products");
            }}
          >
            Products
          </a>

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate("/about");
            }}
          >
            About
          </a>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigate("/contact");
            }}
          >
            Contact
          </a>
        </div>

        {/* ================= NAV ACTIONS ================= */}
        <div className="nav-actions">
          <button
            className="nav-cart-btn"
            onClick={() => navigate("/cart")}
          >
            🛒 Cart ({totalItems})
          </button>

          {savedUser || localStorage.getItem("token") ? (
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="logout-btn"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-pill-badge">
            ✨ NEW SEASON 2026 COLLECTION
          </span>

          <h1>
            {savedUser?.name ? `Welcome back, ${savedUser.name}!` : "Welcome to ShopEase!"}
            <br />
            <span>Everything You Need,</span>
            <br />
            <span>All In One Place.</span>
          </h1>

          <p className="hero-text">
            Explore premium handpicked lifestyle goods, top-tier audio, wearable tech, and daily essentials with fast delivery and guaranteed Razorpay security.
          </p>

          <div className="hero-btn-group">
            <button
              className="shop-btn hero-primary-btn"
              onClick={goToProducts}
            >
              Explore Products Catalog →
            </button>
            <a
              href="#categories"
              className="hero-secondary-btn"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Categories ↓
            </a>
          </div>

          <div className="hero-trust-metrics">
            <div className="trust-metric-item">
              <span className="metric-icon">⭐</span>
              <span className="metric-text"><strong>4.9 / 5.0</strong> Customer Rating</span>
            </div>
            <div className="trust-metric-divider"></div>
            <div className="trust-metric-item">
              <span className="metric-icon">⚡</span>
              <span className="metric-text"><strong>Fast Dispatch</strong> Within 24 Hours</span>
            </div>
            <div className="trust-metric-divider"></div>
            <div className="trust-metric-item">
              <span className="metric-icon">🔒</span>
              <span className="metric-text"><strong>100% Secure</strong> Razorpay Gateway</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITIONS STRIP ================= */}
      <section className="store-features-strip">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🚚</div>
            <div className="feature-info">
              <h4>Free Express Delivery</h4>
              <p>On all prepaid orders over ₹499 with live tracking</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🔒</div>
            <div className="feature-info">
              <h4>Secure Razorpay Checkout</h4>
              <p>256-bit encrypted UPI, Cards & NetBanking payments</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🔄</div>
            <div className="feature-info">
              <h4>7-Day Easy Returns</h4>
              <p>Instant replacement or refund if unsatisfied</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🎧</div>
            <div className="feature-info">
              <h4>24/7 Dedicated Support</h4>
              <p>Our concierge team is here to assist with every order</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="home-categories-section" id="categories">
        <div className="section-header-center">
          <span className="section-tag">CURATED DEPARTMENTS</span>
          <h2>Shop By Category</h2>
          <p>Choose a category to browse handpicked, premium gear in our dedicated catalog</p>
        </div>

        <div className="categories-cards-grid">
          <div
            className="category-showcase-card"
            onClick={() => navigate("/products", { state: { category: "Electronics" } })}
          >
            <div className="cat-card-icon">🎧</div>
            <div className="cat-card-content">
              <h3>Electronics & Audio</h3>
              <p>High-fidelity headphones, earbuds, and premium sound gear</p>
              <span className="cat-card-link">Explore Electronics →</span>
            </div>
          </div>

          <div
            className="category-showcase-card"
            onClick={() => navigate("/products", { state: { category: "Fashion" } })}
          >
            <div className="cat-card-icon">👕</div>
            <div className="cat-card-content">
              <h3>Fashion & Apparel</h3>
              <p>Trendy apparel, timeless designs, and contemporary streetwear</p>
              <span className="cat-card-link">Explore Fashion →</span>
            </div>
          </div>

          <div
            className="category-showcase-card"
            onClick={() => navigate("/products", { state: { category: "Home" } })}
          >
            <div className="cat-card-icon">🏠</div>
            <div className="cat-card-content">
              <h3>Home & Living</h3>
              <p>Modern lifestyle decor, organizers, and everyday essentials</p>
              <span className="cat-card-link">Explore Home Goods →</span>
            </div>
          </div>

          <div
            className="category-showcase-card"
            onClick={() => navigate("/products", { state: { category: "Wearables" } })}
          >
            <div className="cat-card-icon">⌚</div>
            <div className="cat-card-content">
              <h3>Wearables & Gadgets</h3>
              <p>Fitness trackers, smartwatches, and everyday pocket tech</p>
              <span className="cat-card-link">Explore Gadgets →</span>
            </div>
          </div>
        </div>

        <div className="categories-cta-center">
          <button
            className="shop-btn catalog-btn"
            onClick={goToProducts}
          >
            Open Dedicated Products Catalog ({products.length || "10+"} items) →
          </button>
        </div>
      </section>

      {/* ================= FLASH PROMO BANNER ================= */}
      <section className="home-promo-banner">
        <div className="promo-banner-content">
          <span className="promo-tag">⚡ LIMITED TIME OFFER</span>
          <h2>Exclusive Weekend Deals: Up to 35% Off</h2>
          <p>
            Upgrade your daily lifestyle setup with handpicked essentials. Fair shopping policy: maximum 2 units per customer so everyone gets a chance!
          </p>
          <div className="promo-actions">
            <button
              className="promo-action-btn"
              onClick={goToProducts}
            >
              Shop Sale Items in Catalog →
            </button>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER REVIEWS ================= */}
      <section className="home-reviews-section">
        <div className="section-header-center">
          <span className="section-tag">COMMUNITY VOICES</span>
          <h2>What Our Customers Say</h2>
          <p>Real experiences from verified shoppers across India</p>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-comment">
              "Ordered the Wireless Noise-Canceling Headphones and they arrived in 2 days! Sound quality is phenomenal and checkout with Razorpay was seamless."
            </p>
            <div className="review-author">
              <span className="author-avatar">R</span>
              <div>
                <p className="author-name">Rahul Sharma</p>
                <p className="author-badge">✓ Verified Buyer · Mumbai</p>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-comment">
              "The product details page showed every single spec accurately. Love the 2-unit limit policy because popular items don't get scalped."
            </p>
            <div className="review-author">
              <span className="author-avatar">P</span>
              <div>
                <p className="author-name">Priya Patel</p>
                <p className="author-badge">✓ Verified Buyer · Bengaluru</p>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">★★★★★</div>
            <p className="review-comment">
              "Customer service answered my address update request in minutes. Smooth UPI payment, packaging was top tier. Highly recommended!"
            </p>
            <div className="review-author">
              <span className="author-avatar">A</span>
              <div>
                <p className="author-name">Ananya Verma</p>
                <p className="author-badge">✓ Verified Buyer · Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA STRIP ================= */}
      <section className="home-final-cta">
        <div className="final-cta-box">
          <h2>Ready to Upgrade Your Daily Essentials?</h2>
          <p>
            Join thousands of satisfied shoppers. Explore our dedicated catalog with instant search, category filters, and live stock tracking.
          </p>
          <button
            className="shop-btn final-shop-btn"
            onClick={goToProducts}
          >
            Enter Store & Shop Now →
          </button>
        </div>
      </section>

      {/* ================= STORE FOOTER ================= */}
      <footer className="home-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <h3 className="footer-logo">🛍️ ShopEase</h3>
            <p className="footer-desc">
              Your trusted destination for curated electronics, apparel, lifestyle goods, and smart wearables. Built with seamless checkout and prompt delivery.
            </p>
            <div className="footer-secure-note">
              🔒 Powered by 256-bit encrypted Razorpay payment gateway.
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/home" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Home</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate("/products"); }}>Products Catalog</a></li>
              <li><a href="/cart" onClick={(e) => { e.preventDefault(); navigate("/cart"); }}>View Cart ({totalItems})</a></li>
              <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>About ShopEase</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Departments</h4>
            <ul>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate("/products", { state: { category: "Electronics" } }); }}>Electronics</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate("/products", { state: { category: "Fashion" } }); }}>Fashion & Apparel</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate("/products", { state: { category: "Home" } }); }}>Home & Living</a></li>
              <li><a href="/products" onClick={(e) => { e.preventDefault(); navigate("/products", { state: { category: "Wearables" } }); }}>Wearables & Tech</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Accepted Payments</h4>
            <div className="payment-badges-row">
              <span className="pay-badge">Razorpay</span>
              <span className="pay-badge">UPI</span>
              <span className="pay-badge">Visa</span>
              <span className="pay-badge">Mastercard</span>
              <span className="pay-badge">NetBanking</span>
            </div>
            <p className="policy-text">
              Orders backed by 7-day hassle-free replacement policy.
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 ShopEase E-Commerce Platform. All rights reserved.</p>
          <p className="footer-admin-link" onClick={() => navigate("/admin")}>Admin Portal</p>
        </div>
      </footer>

      {/* ================= ADD TO CART NOTIFICATION ================= */}
      {notification && (
        <div className="cart-notification">
          ✓ {notification} added to Cart!
        </div>
      )}
    </div>
  );
}


/* ================= ADMIN ROUTE GUARD ================= */

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  if (!adminToken || !adminUser) {
    return <Navigate to="/admin" replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    if (user.role !== "admin") {
      return <Navigate to="/admin" replace />;
    }
  } catch {
    return <Navigate to="/admin" replace />;
  }

  return children;
}


/* =========================================================
   APP ROUTES
======================================================== */

function App() {
  return (
    <Routes>
      {/* ================= CUSTOMER ROUTES ================= */}

      <Route
        path="/"
        element={
          <Auth initialTab="login" />
        }
      />

      <Route
        path="/login"
        element={
          <Auth initialTab="login" />
        }
      />

      <Route
        path="/signup"
        element={
          <Auth initialTab="signup" />
        }
      />

      <Route
        path="/home"
        element={
          <Home />
        }
      />

      {/* ================= DEDICATED PRODUCTS / SHOP PAGE ================= */}

      <Route
        path="/products"
        element={<ProductsPage />}
      />

      <Route
        path="/shop"
        element={<Navigate to="/products" replace />}
      />

      {/* ================= CART ================= */}

      <Route
        path="/cart"

        element={
          <Cart />
        }
      />


      {/* ================= CHECKOUT ================= */}

       <Route
        path="/checkout"
        element={
          <Checkout />
        }
      />


      {/* ================= ORDER SUCCESS ================= */}

       <Route
         path="/order-success"
         element={
          <OrderSuccess />
        }
      />


      {/* ================= ABOUT ================= */}

      <Route
        path="/about"

        element={
          <About />
        }
      />


      {/* ================= CONTACT ================= */}

      <Route
        path="/contact"

        element={
          <Contact />
        }
      />


      {/* ================= ADMIN LOGIN ================= */}

      <Route
        path="/admin"

        element={
          <AdminLogin />
        }
      />


      {/* ================= ADMIN DASHBOARD ================= */}

      <Route
        path="/admin/dashboard"

        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN PRODUCTS ================= */}

      <Route
        path="/admin/products"

        element={
          <AdminRoute>
            <AdminProduct />
          </AdminRoute>
        }
      />


      <Route
        path="/admin/products/add"

        element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        }
      />


      <Route
        path="/admin/products/edit/:id"

        element={
          <AdminRoute>
            <EditProduct />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN ORDERS ================= */}

      <Route
        path="/admin/orders"

        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN USERS ================= */}

      <Route
        path="/admin/users"

        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />


    </Routes>

  );
}


export default App;