import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "./AdminLayout";

function AdminProducts() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "all"
  );
  const [selectedStockFilter, setSelectedStockFilter] = useState("all");

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add mode
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Laptops",
    brand: "",
    price: "",
    stock: "5",
    image: "",
    description: "",
    specs: {},
  });

  // Specs editor
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");

  // Delete Modal
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Fetch products from database (same unified active catalog as customer store)
  const fetchProducts = async () => {
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
        throw new Error("Failed to load products from database.");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setErrorMessage("Failed to load products from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update selectedCategory if location state changes
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast("");
    }, 3500);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== "all") {
        const pCat = (p.category || "").toLowerCase();
        const sCat = selectedCategory.toLowerCase();
        const catMatch =
          pCat === sCat ||
          (sCat.includes("fashion") && pCat.includes("fashion")) ||
          pCat.includes(sCat);
        if (!catMatch) return false;
      }

      // Stock status match
      const stock = Number(p.stock !== undefined ? p.stock : 0);
      if (selectedStockFilter === "out_of_stock" && stock > 0) return false;
      if (selectedStockFilter === "low_stock" && (stock < 1 || stock > 5))
        return false;
      if (selectedStockFilter === "in_stock" && stock <= 5) return false;

      // Search match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (p.name || "").toLowerCase().includes(term);
        const brandMatch = (p.brand || "").toLowerCase().includes(term);
        const catText = (p.category || "").toLowerCase().includes(term);
        const descText = (p.description || p.shortDescription || "").toLowerCase().includes(term);
        const idText = String(p._id || "").toLowerCase().includes(term);
        if (!nameMatch && !brandMatch && !catText && !descText && !idText) return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedStockFilter, searchTerm]);

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Laptops",
      brand: "",
      price: "",
      stock: "5",
      image: "",
      description: "",
      specs: {},
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "Laptops",
      brand: product.brand || "",
      price: String(product.price || ""),
      stock: String(product.stock !== undefined ? product.stock : 1),
      image: product.image || product.imageUrl || "",
      description: product.description || product.shortDescription || "",
      specs: product.specs && typeof product.specs === "object" ? { ...product.specs } : {},
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle Spec addition
  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [specKey.trim()]: specVal.trim(),
      },
    }));
    setSpecKey("");
    setSpecVal("");
  };

  const handleRemoveSpec = (keyToRemove) => {
    setFormData((prev) => {
      const nextSpecs = { ...prev.specs };
      delete nextSpecs[keyToRemove];
      return { ...prev, specs: nextSpecs };
    });
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!formData.category) {
      setFormError("Please select a category.");
      return;
    }
    const numPrice = Number(formData.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("Price must be a valid positive number.");
      return;
    }
    if (numPrice > 25000) {
      setFormError("Product selling price cannot exceed ₹25,000.");
      return;
    }
    const numStock = Number(formData.stock);
    if (isNaN(numStock) || numStock < 0) {
      setFormError("Stock must be a non-negative number.");
      return;
    }
    if (!formData.image.trim()) {
      setFormError("Image URL is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      const adminToken = localStorage.getItem("adminToken");

      const url = editingProduct
        ? getApiUrl(`/api/products/${editingProduct._id}`)
        : getApiUrl("/api/products");

      const method = editingProduct ? "PUT" : "POST";

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim() || "ShopEase",
        price: numPrice,
        stock: numStock,
        image: formData.image.trim(),
        description: formData.description.trim(),
        shortDescription: formData.description.trim(),
        specs: formData.specs,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save product.");
      }

      showToast(
        editingProduct
          ? "Product updated successfully."
          : "New product created successfully."
      );
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Save product error:", err);
      setFormError(err.message || "Failed to save product.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleteSubmitting(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        getApiUrl(`/api/products/${deletingProduct._id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product.");
      }

      showToast(`Product "${deletingProduct.name}" removed from catalog.`);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      alert(err.message || "Failed to delete product.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  return (
    <AdminLayout active="products" title="Products">
      {/* PAGE HEADER */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Products</h1>
          <p className="adm-page-subtitle">
            Manage your store catalogue ({filteredProducts.length} items shown)
          </p>
        </div>
        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-btn adm-btn-action-primary"
            onClick={handleOpenAdd}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {successToast && (
        <div className="adm-alert adm-alert-success" style={{ marginBottom: "16px" }}>
          <span>✓ {successToast}</span>
        </div>
      )}

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "16px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
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
            placeholder="Search by name, brand or keyword..."
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Phones">Phones</option>
          <option value="Accessories">Accessories</option>
          <option value="Fashion & Apparel">Fashion & Apparel</option>
        </select>

        {/* STOCK STATUS FILTER */}
        <select
          className="adm-filter-select"
          value={selectedStockFilter}
          onChange={(e) => setSelectedStockFilter(e.target.value)}
        >
          <option value="all">All Stock Statuses</option>
          <option value="in_stock">In Stock (&gt; 5)</option>
          <option value="low_stock">Low Stock (1–5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="adm-dashboard-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Product</th>
                <th style={{ whiteSpace: "nowrap" }}>Category</th>
                <th style={{ whiteSpace: "nowrap" }}>Price</th>
                <th style={{ whiteSpace: "nowrap" }}>Stock</th>
                <th style={{ whiteSpace: "nowrap" }}>Status</th>
                <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Actions</th>
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
                    Loading catalog from database...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const stockNum = Number(p.stock !== undefined ? p.stock : 0);

                  return (
                    <tr key={p._id}>
                      {/* PRODUCT (THUMB + NAME + BRAND + PRODUCT ID) */}
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
                            <span
                              className="adm-product-cell-name"
                              title={p.description || p.shortDescription || p.name}
                            >
                              {p.name}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "3px",
                              }}
                            >
                              <span className="adm-product-cell-brand">
                                {p.brand || "ShopEase"}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "var(--adm-text-dim)",
                                  fontFamily: "monospace",
                                  letterSpacing: "0.02em",
                                }}
                                title="MongoDB Product ID"
                              >
                                ID: {p._id}
                              </span>
                            </div>
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

                      {/* STOCK */}
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {stockNum} units
                      </td>

                      {/* STATUS */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        {stockNum === 0 ? (
                          <span className="adm-status-pill danger" style={{ whiteSpace: "nowrap" }}>Out of Stock</span>
                        ) : stockNum <= 5 ? (
                          <span className="adm-status-pill warning" style={{ whiteSpace: "nowrap" }}>Low Stock</span>
                        ) : (
                          <span className="adm-status-pill success" style={{ whiteSpace: "nowrap" }}>In Stock</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          {/* VIEW IN ADMIN PANEL */}
                          <Link
                            to={`/admin/products/${p._id}`}
                            className="adm-btn adm-btn-secondary adm-btn-sm"
                            title="View product details in Admin Panel"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            View
                          </Link>

                          {/* EDIT PRODUCT */}
                          <button
                            type="button"
                            className="adm-btn adm-btn-secondary adm-btn-sm"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit product"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Edit
                          </button>

                          {/* DELETE PRODUCT */}
                          <button
                            type="button"
                            className="adm-btn adm-btn-danger adm-btn-sm"
                            onClick={() => setDeletingProduct(p)}
                            title="Delete product"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Delete
                          </button>
                        </div>
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
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="adm-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">
                {editingProduct ? (
                  <span>
                    Edit Product Details{" "}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--adm-text-dim)",
                        fontFamily: "monospace",
                        fontWeight: 400,
                      }}
                    >
                      (ID: {editingProduct._id})
                    </span>
                  </span>
                ) : (
                  "Add New Store Product"
                )}
              </h3>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="adm-modal-body">
                {formError && (
                  <div className="adm-alert adm-alert-error">
                    <span>{formError}</span>
                  </div>
                )}

                {/* PRODUCT NAME */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Product Name *</label>
                  <input
                    type="text"
                    className="adm-form-input"
                    placeholder="e.g. Apple iPhone 15 Pro Max (256GB)"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* CATEGORY & BRAND */}
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category *</label>
                    <select
                      className="adm-form-input"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      <option value="Laptops">Laptops</option>
                      <option value="Phones">Phones</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Brand</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Apple, Lenovo, HRX"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* PRICE & STOCK */}
                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="adm-form-input"
                      placeholder="e.g. 19999 (Max ₹25,000)"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      min="1"
                      max="25000"
                      required
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Available Stock Quantity *</label>
                    <input
                      type="number"
                      className="adm-form-input"
                      placeholder="e.g. 3"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* IMAGE URL WITH INSTANT PREVIEW */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL *</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="url"
                      className="adm-form-input"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      required
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "4px",
                          objectFit: "contain",
                          background: "#0a0e1a",
                          border: "1px solid var(--adm-border-card)",
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Product Description</label>
                  <textarea
                    className="adm-form-textarea"
                    placeholder="Enter unique product description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                  />
                </div>

                {/* SPECIFICATIONS KEY-VALUE EDITOR */}
                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Technical Specifications
                  </label>

                  {/* CURRENT SPECS PILLS */}
                  {Object.keys(formData.specs || {}).length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "10px",
                        maxHeight: "120px",
                        overflowY: "auto",
                      }}
                    >
                      {Object.entries(formData.specs).map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--adm-border-subtle)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <strong style={{ color: "var(--adm-text-secondary)" }}>
                            {k}:
                          </strong>
                          <span style={{ color: "var(--adm-text-primary)" }}>
                            {v}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(k)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--adm-text-dim)",
                              cursor: "pointer",
                              padding: "0 2px",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ADD NEW SPEC ROW */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="Spec Name (e.g. Processor)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="Value (e.g. Intel Core i7)"
                      value={specVal}
                      onChange={(e) => setSpecVal(e.target.value)}
                      style={{ flex: 1.5 }}
                    />
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary"
                      onClick={handleAddSpec}
                      disabled={!specKey.trim() || !specVal.trim()}
                    >
                      Add Spec
                    </button>
                  </div>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn adm-btn-action-primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting
                    ? "Saving to Database..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProduct && (
        <div
          className="adm-modal-backdrop"
          onClick={() => setDeletingProduct(null)}
        >
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Delete Product</h3>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setDeletingProduct(null)}
              >
                ✕
              </button>
            </div>
            <div className="adm-modal-body">
              <p
                style={{
                  margin: 0,
                  fontSize: "13.5px",
                  color: "var(--adm-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Are you sure you want to permanently delete{" "}
                <strong style={{ color: "var(--adm-text-primary)" }}>
                  "{deletingProduct.name}"
                </strong>
                ? This will remove the product record from the MongoDB database.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setDeletingProduct(null)}
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProducts;
