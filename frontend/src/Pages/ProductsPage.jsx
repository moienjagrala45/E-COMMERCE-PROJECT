import { useContext, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { EXISTING_STORE_PRODUCTS, enrichProduct } from "../data/productsData";
import { getApiUrl } from "../config/api";

function ProductsPage() {
  const location = useLocation();
  const { notification } = useContext(CartContext) || {};

  const [products, setProducts] = useState(EXISTING_STORE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "All"
  );
  const [searchQuery, setSearchQuery] = useState(
    location.state?.search || ""
  );

  // Sync state if navigation pushed new state from Home
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    if (location.state?.search !== undefined) {
      setSearchQuery(location.state.search);
    }
  }, [location.state]);

  // Fetch live products from backend if running, otherwise use verified store catalog
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl("/api/products"), {
          cache: "no-store",
        });

        if (response.ok) {
          const liveData = await response.json();
          if (isMounted && Array.isArray(liveData) && liveData.length > 0) {
            const enrichedLive = liveData.map(enrichProduct);
            setProducts(enrichedLive);
          }
        }
      } catch {
        // Fallback to verified local catalog
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Centered text-based categories: All, Laptops, Phones, Accessories, Fashion
  const categories = [
    { label: "All", value: "All" },
    { label: "Laptops", value: "Laptops" },
    { label: "Phones", value: "Phones" },
    { label: "Accessories", value: "Accessories" },
    { label: "Fashion & Apparel", value: "Fashion & Apparel" },
  ];

  // Filtering: searches keyword (Dell, Samsung, Laptop, etc.) + category filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const sCat = selectedCategory.toLowerCase();

      const matchesCat =
        selectedCategory === "All" ||
        pCat === sCat ||
        (sCat === "fashion & apparel" && pCat.includes("fashion")) ||
        (sCat === "fashion" && pCat.includes("fashion"));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        pCat.includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        (p.shortDescription || "").toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="shopease-dark-root">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. CENTERED CATEGORY NAVIGATION (No heading, no count, no sort dropdown) */}
      <section className="catalog-nav-wrapper">
        <div className="catalog-nav-container">
          <nav className="catalog-centered-nav" aria-label="Product categories">
            {categories.map((cat) => {
              const isActive =
                selectedCategory.toLowerCase() === cat.value.toLowerCase() ||
                (cat.value === "Fashion & Apparel" &&
                  (selectedCategory.toLowerCase() === "fashion" ||
                    selectedCategory.toLowerCase().includes("fashion")));

              return (
                <button
                  key={cat.label}
                  type="button"
                  className={`catalog-cat-link ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <span className="catalog-cat-label">{cat.label}</span>
                  {isActive && <span className="catalog-cat-active-line" />}
                </button>
              );
            })}
          </nav>

          {/* ACTIVE SEARCH FILTER BANNER (If user searched from navbar) */}
          {searchQuery && (
            <div className="catalog-search-strip">
              <span>
                Filtering results for: <strong>"{searchQuery}"</strong>
              </span>
              <button
                type="button"
                className="clear-search-link"
                onClick={() => setSearchQuery("")}
                aria-label="Clear active search"
              >
                Clear Search ✕
              </button>
            </div>
          )}
        </div>
        <div className="catalog-nav-divider" />
      </section>

      {/* 3. PRODUCTS GRID */}
      <main className="catalog-main">
        <div className="section-container">
          {loading ? (
            <div className="catalog-state-box">
              <h3>Loading catalog...</h3>
              <p>Fetching available inventory items.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="catalog-state-box">
              <h3>No products found</h3>
              <p>Try searching for a different keyword or resetting your category filter.</p>
              <button
                type="button"
                className="catalog-reset-btn"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FLOATING CART NOTIFICATION */}
      {notification && (
        <div className="cart-notification-floating">
          <span>✓</span>
          <span>{notification} added to Cart</span>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
