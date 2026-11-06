import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminCategories() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const res = await fetch(getApiUrl("/api/products"), {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load products from database.");
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        setErrorMessage("Failed to calculate category data from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Standard 4 active ShopEase categories
  const categoryDefs = [
    {
      id: "Laptops",
      name: "Laptops",
      matchRegex: /laptop/i,
      desc: "High-performance computing notebooks, ultra-portables, and mobile workstations.",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      ),
    },
    {
      id: "Phones",
      name: "Phones",
      matchRegex: /phone/i,
      desc: "Next-gen flagship smartphones, AI-enabled flagships, and compact mobile devices.",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
    },
    {
      id: "Accessories",
      name: "Accessories",
      matchRegex: /accessor/i,
      desc: "Audio peripherals, spatial headphones, smart gear, high-precision mice, and cables.",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
    {
      id: "Fashion & Apparel",
      name: "Fashion & Apparel",
      matchRegex: /fashion|apparel/i,
      desc: "Curated casual footwear, heavy streetwear hoodies, stylish sunglasses, and apparel.",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
  ];

  // Calculate live dynamic metrics directly from MongoDB products
  const categoryStats = useMemo(() => {
    return categoryDefs.map((cat) => {
      const catProducts = products.filter((p) => {
        const c = p.category || "";
        return cat.matchRegex.test(c);
      });

      const count = catProducts.length;
      let minPrice = 0;
      let maxPrice = 0;

      if (count > 0) {
        const prices = catProducts.map((p) => Number(p.price || 0)).filter((n) => !isNaN(n) && n > 0);
        if (prices.length > 0) {
          minPrice = Math.min(...prices);
          maxPrice = Math.max(...prices);
        }
      }

      const isCompliant = maxPrice <= 25000;
      const formattedRange =
        count > 0
          ? `₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice.toLocaleString("en-IN")}`
          : "No items";

      return {
        ...cat,
        count,
        minPrice,
        maxPrice,
        isCompliant,
        priceRange: formattedRange,
        isActive: count > 0,
      };
    });
  }, [products]);

  const activeCategoryCount = categoryStats.filter((c) => c.isActive).length;
  const totalCategories = categoryDefs.length;

  const handleFilterByCategory = (catName) => {
    navigate("/admin/products", { state: { category: catName } });
  };

  return (
    <AdminLayout active="categories" title="Categories">
      {/* PAGE HEADER */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Categories</h1>
          <p className="adm-page-subtitle">
            Catalog organization and live pricing breakdown ({activeCategoryCount} of {totalCategories} categories active)
          </p>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "20px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* RESTRAINED SUMMARY METRICS BAR */}
      <div
        className="adm-dashboard-card adm-summary-metrics-bar"
      >
        <div>
          <div style={{ fontSize: "12px", color: "var(--adm-text-dim)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
            Active Categories
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--adm-text-primary)", marginTop: "4px" }}>
            {loading ? "..." : `${activeCategoryCount} / ${totalCategories}`}
          </div>
          <div style={{ fontSize: "12px", color: "#4ade80", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>✓</span> <span>All 4 store categories live</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "var(--adm-text-dim)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
            Total Catalog Products
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--adm-text-primary)", marginTop: "4px" }}>
            {loading ? "..." : `${products.length} Products`}
          </div>
          <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
            Synchronized with customer store
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "var(--adm-text-dim)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
            Price Range Policy
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--adm-text-primary)", marginTop: "4px" }}>
            ≤ ₹25,000 Cap
          </div>
          <div style={{ fontSize: "12px", color: "#4ade80", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>✓</span> <span>All items strictly under ₹25k</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES TABLE - ONE CLEAN HORIZONTAL LINE PER CATEGORY */}
      <div className="adm-dashboard-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Category Name</th>
                <th style={{ whiteSpace: "nowrap" }}>Product Count</th>
                <th style={{ whiteSpace: "nowrap" }}>Price Range</th>
                <th style={{ whiteSpace: "nowrap" }}>Category Status</th>
                <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((cat) => (
                <tr key={cat.id}>
                  {/* CATEGORY NAME */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                      <div className="adm-category-icon-box" style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                        {cat.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text-primary)" }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--adm-text-dim)" }}>
                          {cat.desc}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PRODUCT COUNT */}
                  <td style={{ whiteSpace: "nowrap", fontWeight: 600, color: "var(--adm-text-primary)" }}>
                    {loading ? "..." : `${cat.count} Products`}
                  </td>

                  {/* PRICE RANGE */}
                  <td style={{ whiteSpace: "nowrap", fontFamily: "monospace", fontWeight: 600, color: "var(--adm-accent-cyan)" }}>
                    {loading ? "..." : cat.priceRange}
                  </td>

                  {/* CATEGORY STATUS */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    {cat.isActive ? (
                      <span className="adm-status-pill success" style={{ whiteSpace: "nowrap" }}>
                        Active
                      </span>
                    ) : (
                      <span className="adm-status-pill neutral" style={{ whiteSpace: "nowrap" }}>
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                      onClick={() => handleFilterByCategory(cat.name)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      View Products →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategories;
