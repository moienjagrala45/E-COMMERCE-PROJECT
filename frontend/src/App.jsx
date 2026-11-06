import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./App.css";
import "./Pages/About.css";
import "./ShopEaseDesign.css";

/* ================= CUSTOMER COMPONENTS ================= */
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import OrderSuccess from "./components/OrderSuccess";
import Footer from "./components/Footer";

/* ================= CUSTOMER PAGES ================= */
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ProductsPage from "./Pages/ProductsPage";
import ProductDetails from "./Pages/ProductDetails";

/* ================= ADMIN COMPONENTS ================= */
import AdminProduct from "./components/AdminProduct";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/Adminlogin";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";
import AdminCategories from "./Pages/AdminCategories";
import AdminInventory from "./Pages/AdminInventory";
import AdminSettings from "./Pages/AdminSettings";
import AdminProductDetail from "./Pages/AdminProductDetail";
import AdminOrderDetail from "./Pages/AdminOrderDetail";
import AdminCustomerDetail from "./Pages/AdminCustomerDetail";

/* =========================================================
   CUSTOMER HOME PAGE
========================================================= */

function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Smooth scroll helper for Browse Categories
  const scrollToCategories = () => {
    const el = document.getElementById("browse-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Direct category navigation into catalog
  const handleCategoryClick = (categoryName) => {
    navigate("/products", { state: { category: categoryName } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    {
      name: "Laptops",
      desc: "Performance and ultralight notebooks.",
      value: "Laptops",
      image: "/cat-laptops.png",
    },
    {
      name: "Phones",
      desc: "Flagship cameras and modern smartphones.",
      value: "Phones",
      image: "/cat-phones.png",
    },
    {
      name: "Accessories",
      desc: "Audio, chargers, cables and workspace gear.",
      value: "Accessories",
      image: "/cat-accessories.png",
    },
    {
      name: "Fashion & Apparel",
      desc: "Everyday styles made easy to browse.",
      value: "Fashion & Apparel",
      image: "/cat-fashion.png",
    },
  ];

  return (
    <div className="shopease-dark-root">
      {/* 1. NAVBAR */}
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />

      {/* 2. HERO SECTION */}
      <header className="shopease-hero">
        <div className="hero-container">
          {/* LEFT: BRAND MESSAGE & ACTIONS */}
          <div className="hero-content">
            <span className="hero-label">ONE PLACE. MORE CHOICE.</span>
            <h1 className="hero-title">
              Everything You Need, <br />
              <span className="hero-title-accent">All in One Place.</span>
            </h1>
            <p className="hero-description">
              Explore tech, fashion, accessories and everyday essentials with a shopping experience designed to stay simple.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-btn"
                onClick={() => navigate("/products")}
              >
                <span>Explore Products</span>
              </button>
              <button
                type="button"
                className="hero-secondary-btn"
                onClick={scrollToCategories}
              >
                <span>Browse Categories</span>
                <span className="hero-arrow-symbol" aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* RIGHT: ONE LARGE COHESIVE LIFESTYLE VISUAL */}
          <div className="hero-visual-frame">
            <img
              src="/hero-lifestyle.png"
              alt="ShopEase modern workspace and everyday essentials"
              className="hero-visual-img"
              onError={(e) => {
                e.currentTarget.src = "/hero-showcase.png";
              }}
            />
          </div>
        </div>
      </header>

      {/* 3. BROWSE CATEGORIES (EDITORIAL TILES) */}
      <section className="home-categories-section" id="browse-categories">
        <div className="section-container">
          <div className="section-header-wrap">
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">
              Start with what you're looking for.
            </p>
          </div>

          <div className="home-cat-grid">
            {categories.map((cat) => (
              <article
                key={cat.name}
                className="home-cat-card"
                onClick={() => handleCategoryClick(cat.value)}
                role="button"
                tabIndex={0}
              >
                <div className="home-cat-media">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="home-cat-img"
                  />
                </div>
                <div className="home-cat-info">
                  <div className="home-cat-title-row">
                    <h3 className="home-cat-name">{cat.name}</h3>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="home-cat-arrow"
                      aria-hidden="true"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                  <p className="home-cat-desc">{cat.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPLETE FOOTER */}
      <Footer />

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          className="shopease-auth-modal-overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="shopease-auth-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-modal-close-btn"
              onClick={() => setShowAuthModal(false)}
            >
              ✕
            </button>
            <Auth
              initialTab="login"
              onClose={() => setShowAuthModal(false)}
              onAuthSuccess={() => {
                setShowAuthModal(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ADMIN ROUTE PROTECTION
========================================================= */

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
   APP ROUTES (ALL URLS AND PAGES PRESERVED)
========================================================= */

function App() {
  return (
    <Routes>
      {/* ROOT URL DIRECTLY OPENS HOME */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* LOGIN & SIGNUP */}
      <Route path="/login" element={<Auth initialTab="login" />} />
      <Route path="/signup" element={<Auth initialTab="signup" />} />

      {/* PRODUCTS CATALOG */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/shop" element={<Navigate to="/products" replace />} />

      {/* DEDICATED PRODUCT DETAILS */}
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* CART & CHECKOUT */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />

      {/* ABOUT & CONTACT */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
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
      <Route
        path="/admin/products/:id"
        element={
          <AdminRoute>
            <AdminProductDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <AdminRoute>
            <AdminOrderDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <AdminRoute>
            <AdminCustomerDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/customers/:id"
        element={
          <AdminRoute>
            <AdminCustomerDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <AdminRoute>
            <AdminInventory />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
