import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { EXISTING_STORE_PRODUCTS, enrichProduct } from "../data/productsData";
import "./ProductsPage.css";

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, notification } = useContext(CartContext);

  const [products, setProducts] = useState(EXISTING_STORE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  /* ================= TOTAL CART ITEMS ================= */
  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  /* ================= FETCH PRODUCTS FROM LIVE API ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://e-commerce-project-backend-vpdz.onrender.com/api/products",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch live products");
        }

        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Enrich with accurate specs while keeping all live DB values
          const enriched = data.map(enrichProduct);
          setProducts(enriched);
        }
      } catch (error) {
        console.warn("Using verified store products fallback:", error);
        if (isMounted) {
          setProducts(EXISTING_STORE_PRODUCTS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLiveProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= DYNAMIC CATEGORIES ================= */
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  /* ================= FILTER & SORT PRODUCTS ================= */
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
          !searchQuery.trim() ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return Number(a.price) - Number(b.price);
        }
        if (sortBy === "price-high") {
          return Number(b.price) - Number(a.price);
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="products-page-layout">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          ShopEase
        </div>

        <div className="nav-links">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              navigate("/home");
            }}
          >
            Home
          </a>

          <a
            href="/products"
            className="nav-link-active"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Products
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              navigate("/about");
            }}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              navigate("/contact");
            }}
          >
            Contact
          </a>
        </div>

        <div className="nav-actions">
          <button onClick={() => navigate("/cart")} className="nav-cart-btn">
            🛒 Cart ({totalItems})
          </button>

          {localStorage.getItem("token") ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="logout-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ================= PAGE HEADER & BREADCRUMB ================= */}
      <header className="shop-header-banner">
        <div className="shop-header-inner">
          <div className="shop-breadcrumb">
            <span onClick={() => navigate("/home")}>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Products</span>
          </div>

          <p className="shop-small-subtitle">OUR COMPLETE STORE CATALOG</p>
          <h1 className="shop-main-title">Shop Our Products</h1>
          <p className="shop-lead-text">
            Browse through our authentic collection of electronics, fashion, and
            lifestyle essentials. All products backed by official warranties and
            fast doorstep delivery.
          </p>
        </div>
      </header>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <main className="shop-main-container">
        {/* CONTROLS BAR: CATEGORIES, SEARCH, SORT */}
        <div className="shop-controls-bar">
          {/* CATEGORY FILTER PILLS */}
          <div className="category-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${
                  selectedCategory === cat ? "category-pill-active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH & SORT GROUP */}
          <div className="shop-filter-group">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products by name or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* RESULTS INFO BAR */}
        <div className="shop-results-status">
          <span>
            Showing <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          {(selectedCategory !== "All" || searchQuery) && (
            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortBy("default");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        {loading && products.length === 0 ? (
          <div className="shop-loading-state">
            <div className="shop-spinner" />
            <p>Loading store products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>
              We couldn't find any products matching your selected criteria.
            </p>
            <button
              className="shop-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="shop-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id || product.name}
                product={product}
              />
            ))}
          </div>
        )}
      </main>

      {/* ================= FLOATING CART NOTIFICATION ================= */}
      {notification && (
        <div className="cart-notification" role="status">
          ✓ {notification} added to Cart!
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="shop-footer">
        <div className="shop-footer-inner">
          <div className="footer-brand">
            <h3>ShopEase</h3>
            <p>
              Everything you need, all in one place. Authentic products with
              doorstep delivery.
            </p>
          </div>
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <span onClick={() => navigate("/home")}>Home</span>
            <span onClick={() => navigate("/products")}>Products</span>
            <span onClick={() => navigate("/cart")}>Cart</span>
            <span onClick={() => navigate("/about")}>About Us</span>
            <span onClick={() => navigate("/contact")}>Contact Support</span>
          </div>
          <div className="footer-links-col">
            <h4>Customer Service</h4>
            <span>Orders & Shipping</span>
            <span>Returns & Exchanges</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
        <div className="footer-bottom-copy">
          © {new Date().getFullYear()} ShopEase E-Commerce. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default ProductsPage;
