import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "Laptops",
    brand: "",
    price: "",
    stock: "5",
    image: "",
    description: "",
    specs: {},
  });
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Fetch product from database
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(getApiUrl(`/api/products/${id}`), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Product not found or unavailable.");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Fetch product detail error:", err);
      setErrorMessage(err.message || "Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (!product) return;
    setEditForm({
      name: product.name || "",
      category: product.category || "Laptops",
      brand: product.brand || "",
      price: String(product.price || ""),
      stock: String(product.stock !== undefined ? product.stock : 1),
      image: product.image || product.imageUrl || "",
      description: product.description || product.shortDescription || "",
      specs: product.specs && typeof product.specs === "object" ? { ...product.specs } : {},
    });
    setEditError("");
    setIsEditOpen(true);
  };

  // Add Specification Key-Value
  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setEditForm((prev) => ({
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
    setEditForm((prev) => {
      const nextSpecs = { ...prev.specs };
      delete nextSpecs[keyToRemove];
      return { ...prev, specs: nextSpecs };
    });
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editForm.name.trim()) {
      setEditError("Product name is required.");
      return;
    }
    const numPrice = Number(editForm.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setEditError("Price must be a valid positive number.");
      return;
    }
    if (numPrice > 25000) {
      setEditError("Product selling price cannot exceed ₹25,000.");
      return;
    }
    const numStock = Number(editForm.stock);
    if (isNaN(numStock) || numStock < 0) {
      setEditError("Stock must be a non-negative number.");
      return;
    }
    if (!editForm.image.trim()) {
      setEditError("Image URL is required.");
      return;
    }

    try {
      setEditSubmitting(true);
      const adminToken = localStorage.getItem("adminToken");

      const payload = {
        name: editForm.name.trim(),
        category: editForm.category.trim(),
        brand: editForm.brand.trim() || "ShopEase",
        price: numPrice,
        stock: numStock,
        image: editForm.image.trim(),
        description: editForm.description.trim(),
        shortDescription: editForm.description.trim(),
        specs: editForm.specs,
      };

      const response = await fetch(getApiUrl(`/api/products/${product._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const updated = await response.json();
      if (!response.ok) {
        throw new Error(updated.message || "Failed to update product.");
      }

      setProduct(updated);
      setIsEditOpen(false);
      showToast("Product updated successfully in Admin Panel.");
    } catch (err) {
      console.error("Save product error:", err);
      setEditError(err.message || "Failed to save product.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!product) return;
    try {
      setDeleteSubmitting(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(getApiUrl(`/api/products/${product._id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete product.");
      }

      navigate("/admin/products", {
        state: { toast: `Product "${product.name}" deleted from catalog.` },
      });
    } catch (err) {
      alert(err.message || "Failed to delete product.");
      setDeleteSubmitting(false);
    }
  };

  // Copy MongoDB ID
  const handleCopyId = () => {
    if (!product) return;
    navigator.clipboard.writeText(product._id);
    showToast("Product ID copied to clipboard.");
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  const stockNum = Number(product?.stock !== undefined ? product.stock : 0);
  const isVisible = product?.isVisible !== false;

  return (
    <AdminLayout active="products" title="Product Details">
      {/* TOP ACTION & BREADCRUMB BAR */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Link
              to="/admin/products"
              className="adm-btn adm-btn-secondary adm-btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Products</span>
            </Link>
            <span style={{ color: "var(--adm-text-dim)" }}>/</span>
            <span style={{ color: "var(--adm-text-secondary)", fontSize: "13px" }}>
              {product?.category || "Product"}
            </span>
          </div>
          <h1 className="adm-page-title">{product?.name || "Product Details"}</h1>
          <p className="adm-page-subtitle">
            Manage product specs, live pricing, stock inventory and visibility status.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        {product && (
          <div className="adm-page-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="adm-btn adm-btn-action-primary"
              onClick={handleOpenEdit}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Product</span>
            </button>

            <button
              type="button"
              className="adm-btn adm-btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <span>Delete</span>
            </button>

            {/* PREVIEW IN LIVE STORE (EXPLICIT PREVIEW OPTION) */}
            <a
              href={`/products/${product._id}?preview=admin`}
              target="_blank"
              rel="noreferrer"
              className="adm-btn adm-btn-secondary"
              title="Open customer-facing product view in a new tab"
              onClick={() => {
                sessionStorage.setItem("adminPreviewActive", "true");
                sessionStorage.setItem("adminReturnPath", `/admin/products/${product._id}`);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Preview Live Store</span>
            </a>
          </div>
        )}
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="adm-alert adm-alert-success" style={{ marginBottom: "20px" }}>
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "20px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="adm-dashboard-card" style={{ padding: "60px", textAlign: "center", color: "var(--adm-text-secondary)" }}>
          Loading product details from database...
        </div>
      ) : product ? (
        <div className="adm-product-detail-layout">
          {/* LEFT COLUMN: IMAGE & INVENTORY STATUS CARD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* PRODUCT IMAGE CARD */}
            <div className="adm-dashboard-card" style={{ padding: "20px" }}>
              <div
                style={{
                  width: "100%",
                  height: "320px",
                  borderRadius: "var(--adm-radius-md)",
                  background: "#080c18",
                  border: "1px solid var(--adm-border-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: "16px",
                }}
              >
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = "/shopease-logo.png";
                  }}
                />
              </div>

              <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--adm-text-dim)", wordBreak: "break-all" }}>
                <span style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>Image Source: </span>
                <span>{product.image || product.imageUrl || "No URL provided"}</span>
              </div>
            </div>

            {/* INVENTORY & AVAILABILITY STATUS */}
            <div className="adm-dashboard-card" style={{ padding: "20px" }}>
              <h3 className="adm-card-title" style={{ marginBottom: "16px" }}>Inventory & Visibility</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--adm-text-secondary)", fontSize: "13px" }}>Stock Status:</span>
                  <div>
                    {stockNum === 0 ? (
                      <span className="adm-status-pill danger">0 (Out of stock)</span>
                    ) : stockNum <= 5 ? (
                      <span className="adm-status-pill warning">Only {stockNum} left</span>
                    ) : (
                      <span className="adm-status-pill success">{stockNum} in stock</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--adm-text-secondary)", fontSize: "13px" }}>Selling Price:</span>
                  <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--adm-text-primary)" }}>
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE INFORMATION & SPECS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* CORE DETAILS CARD */}
            <div className="adm-dashboard-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 700,
                      color: "#c084fc",
                    }}
                  >
                    {product.brand || "ShopEase"} · {product.category}
                  </span>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--adm-text-primary)", marginTop: "4px" }}>
                    {product.name}
                  </h2>
                </div>

                <button
                  type="button"
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                  onClick={handleCopyId}
                  title="Click to copy MongoDB Product ID"
                  style={{ fontFamily: "monospace", fontSize: "11px" }}
                >
                  ID: {product._id} 📋
                </button>
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--adm-border-card)" }}>
                <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--adm-text-secondary)", marginBottom: "8px" }}>
                  Product Description
                </h4>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--adm-text-primary)", margin: 0 }}>
                  {product.description || product.shortDescription || "No detailed description provided for this product."}
                </p>
              </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS CARD */}
            <div className="adm-dashboard-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="adm-card-title">Technical Specifications</h3>
                <span style={{ fontSize: "12px", color: "var(--adm-text-dim)" }}>
                  {Object.keys(product.specs || {}).length} attribute(s)
                </span>
              </div>

              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div style={{ border: "1px solid var(--adm-border-card)", borderRadius: "var(--adm-radius-sm)", overflow: "hidden" }}>
                  <table className="adm-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th style={{ width: "35%" }}>Attribute / Specification</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>{key}</td>
                          <td style={{ color: "var(--adm-text-primary)" }}>{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--adm-text-dim)", fontSize: "13px" }}>
                  No extra technical specifications defined for this product. Click "Edit Product" to add attributes.
                </div>
              )}
            </div>

            {/* AUDIT TIMESTAMPS */}
            <div className="adm-dashboard-card" style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", color: "var(--adm-text-dim)" }}>
              <span>Created: {product.createdAt ? new Date(product.createdAt).toLocaleString("en-IN") : "Initial Catalog"}</span>
              <span>Last Modified: {product.updatedAt ? new Date(product.updatedAt).toLocaleString("en-IN") : "Unmodified"}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="adm-modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="adm-modal-dialog" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">
                Edit Product Details <span style={{ fontSize: "12px", color: "var(--adm-text-dim)", fontFamily: "monospace" }}>({product?._id})</span>
              </h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setIsEditOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="adm-modal-body">
                {editError && (
                  <div className="adm-alert adm-alert-error">
                    <span>{editError}</span>
                  </div>
                )}

                <div className="adm-form-group">
                  <label className="adm-form-label">Product Name *</label>
                  <input
                    type="text"
                    className="adm-form-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category *</label>
                    <select
                      className="adm-form-input"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
                      value={editForm.brand}
                      onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="adm-form-input"
                      placeholder="Max ₹25,000"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      min="1"
                      max="25000"
                      required
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="adm-form-input"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL *</label>
                  <input
                    type="url"
                    className="adm-form-input"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-textarea"
                    rows="3"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>

                {/* SPECS EDITOR */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Technical Specifications</label>
                  {Object.keys(editForm.specs || {}).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                      {Object.entries(editForm.specs).map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid var(--adm-border-card)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <strong>{k}:</strong> <span>{v}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(k)}
                            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "8px" }}>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. RAM"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                    />
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. 16GB"
                      value={specVal}
                      onChange={(e) => setSpecVal(e.target.value)}
                    />
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary"
                      onClick={handleAddSpec}
                      disabled={!specKey.trim() || !specVal.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn adm-btn-action-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="adm-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="adm-modal-dialog" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Delete Product</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>
            <div className="adm-modal-body">
              <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>"{product.name}"</strong>? This will remove the product permanently from the catalog.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProductDetail;

