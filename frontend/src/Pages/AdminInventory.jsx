import { useEffect, useState, useMemo } from "react";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockLevelFilter, setStockLevelFilter] = useState("all");

  // Track stock edits before saving: { [productId]: number }
  const [editedStock, setEditedStock] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const adminToken = localStorage.getItem("adminToken");
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

      const response = await fetch(getApiUrl("/api/products"), {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load inventory from database.");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
        // Initialize stock tracker
        const init = {};
        data.forEach((p) => {
          init[p._id] = p.stock !== undefined ? p.stock : 0;
        });
        setEditedStock(init);
      }
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setErrorMessage("Failed to load inventory from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Filter inventory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryFilter !== "all") {
        if (
          !(p.category || "")
            .toLowerCase()
            .includes(categoryFilter.toLowerCase())
        ) {
          return false;
        }
      }

      // Stock Level Filter
      const currentStock =
        editedStock[p._id] !== undefined
          ? editedStock[p._id]
          : p.stock || 0;

      if (stockLevelFilter === "out_of_stock" && currentStock > 0) return false;
      if (
        stockLevelFilter === "low_stock" &&
        (currentStock < 1 || currentStock > 5)
      ) {
        return false;
      }
      if (stockLevelFilter === "in_stock" && currentStock <= 5) return false;

      // Search Term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (p.name || "").toLowerCase().includes(term);
        const brandMatch = (p.brand || "").toLowerCase().includes(term);
        if (!nameMatch && !brandMatch) return false;
      }

      return true;
    });
  }, [products, categoryFilter, stockLevelFilter, searchTerm, editedStock]);

  // Adjust stock locally
  const handleStockChange = (productId, newAmount) => {
    const cleanAmount = Math.max(0, parseInt(newAmount, 10) || 0);
    setEditedStock((prev) => ({
      ...prev,
      [productId]: cleanAmount,
    }));
  };

  // Save stock to MongoDB via PUT /api/products/:id
  const handleSaveStock = async (product) => {
    const updatedValue = editedStock[product._id];
    if (updatedValue === undefined) return;

    try {
      setSavingId(product._id);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(getApiUrl(`/api/products/${product._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          stock: updatedValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update stock quantity");
      }

      showToast(`Stock updated to ${updatedValue} units for "${product.name}".`);

      // Update in products list
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, stock: updatedValue } : p
        )
      );
    } catch (err) {
      console.error("Save stock error:", err);
      alert(err.message || "Failed to save stock update.");
    } finally {
      setSavingId(null);
    }
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  const getStockStatusPill = (stock) => {
    if (stock === 0) {
      return <span className="adm-status-pill danger">Out of Stock (0)</span>;
    }
    if (stock <= 5) {
      return (
        <span className="adm-status-pill warning">
          Low Stock (Only {stock} left)
        </span>
      );
    }
    return (
      <span className="adm-status-pill success">In Stock ({stock} units)</span>
    );
  };

  return (
    <AdminLayout active="inventory" title="Inventory">
      {/* PAGE HEADER */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Inventory</h1>
          <p className="adm-page-subtitle">
            Monitor and adjust available stock quantities ({filteredProducts.length} items shown)
          </p>
        </div>
        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={fetchInventory}
            disabled={loading}
          >
            Refresh Inventory
          </button>
        </div>
      </div>

      {/* TOAST SUCCESS */}
      {toastMessage && (
        <div className="adm-alert adm-alert-success" style={{ marginBottom: "16px" }}>
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "16px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="adm-filter-bar">
        {/* SEARCH */}
        <div className="adm-search-input-wrap">
          <svg
            className="adm-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search inventory by product name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="adm-search-clear-btn"
              onClick={() => setSearchTerm("")}
              title="Clear search text"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* CATEGORY FILTER */}
        <select
          className="adm-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
          <option value="Fashion & Apparel">Fashion & Apparel</option>
        </select>

        {/* STOCK LEVEL FILTER */}
        <select
          className="adm-filter-select"
          value={stockLevelFilter}
          onChange={(e) => setStockLevelFilter(e.target.value)}
        >
          <option value="all">All Stock Levels</option>
          <option value="low_stock">Low Stock (1–5 Units)</option>
          <option value="out_of_stock">Out of Stock (0 Units)</option>
          <option value="in_stock">In Stock (&gt; 5 Units)</option>
        </select>
      </div>

      {/* INVENTORY TABLE */}
      <div className="adm-dashboard-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Product</th>
                <th style={{ whiteSpace: "nowrap" }}>Category</th>
                <th style={{ whiteSpace: "nowrap" }}>Price</th>
                <th style={{ whiteSpace: "nowrap" }}>Adjust Stock</th>
                <th style={{ whiteSpace: "nowrap" }}>Stock Status</th>
                <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Update Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--adm-text-secondary)",
                    }}
                  >
                    Loading stock records from database...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const currentEditedStock =
                    editedStock[p._id] !== undefined
                      ? editedStock[p._id]
                      : p.stock || 0;

                  const hasChanged = currentEditedStock !== (p.stock || 0);
                  const isSaving = savingId === p._id;

                  return (
                    <tr key={p._id}>
                      {/* PRODUCT */}
                      <td>
                        <div className="adm-product-cell">
                          <img
                            src={p.image || p.imageUrl}
                            alt={p.name}
                            className="adm-product-thumb"
                            onError={(e) => {
                              e.target.src = "/shopease-logo.png";
                            }}
                          />
                          <div className="adm-product-cell-info">
                            <span className="adm-product-cell-name" title={p.name}>
                              {p.name}
                            </span>
                            <span className="adm-product-cell-brand">
                              {p.brand || "ShopEase"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td style={{ color: "var(--adm-text-secondary)", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                        {p.category}
                      </td>

                      {/* PRICE */}
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {formatCurrency(p.price)}
                      </td>

                      {/* ADJUST STOCK CONTROLS */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div className="adm-stock-input-wrap">
                          <button
                            type="button"
                            className="adm-stock-btn"
                            onClick={() =>
                              handleStockChange(
                                p._id,
                                currentEditedStock - 1
                              )
                            }
                            disabled={currentEditedStock <= 0}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="adm-stock-input"
                            value={currentEditedStock}
                            onChange={(e) =>
                              handleStockChange(p._id, e.target.value)
                            }
                            min="0"
                          />
                          <button
                            type="button"
                            className="adm-stock-btn"
                            onClick={() =>
                              handleStockChange(
                                p._id,
                                currentEditedStock + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* STOCK STATUS PILL */}
                      <td style={{ whiteSpace: "nowrap" }}>{getStockStatusPill(currentEditedStock)}</td>

                      {/* UPDATE BUTTON */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className={`adm-btn adm-btn-sm ${
                            hasChanged
                              ? "adm-btn-action-primary"
                              : "adm-btn-secondary"
                          }`}
                          onClick={() => handleSaveStock(p)}
                          disabled={!hasChanged || isSaving}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {isSaving
                            ? "Saving..."
                            : hasChanged
                            ? "Save Stock"
                            : "Saved"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--adm-text-dim)",
                    }}
                  >
                    No products found matching inventory criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminInventory;

