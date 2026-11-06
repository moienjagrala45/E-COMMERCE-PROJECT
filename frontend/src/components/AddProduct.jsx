import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "./AdminLayout";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("5");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !category.trim() || !image.trim()) {
      setMessage("Product name, category, and image URL are required.");
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setMessage("Price must be a valid number greater than 0.");
      return;
    }
    if (numPrice > 25000) {
      setMessage("Product selling price cannot exceed ₹25,000.");
      return;
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      setMessage("Stock must be a valid non-negative number.");
      return;
    }

    try {
      setSubmitting(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(getApiUrl("/api/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          brand: brand.trim() || "ShopEase",
          price: numPrice,
          stock: numStock,
          image: image.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product.");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Add product error:", err);
      setMessage(err.message || "Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout active="products" title="Add Product">
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Add Product</h1>
          <p className="adm-page-subtitle">
            Add a new item to your active store catalogue.
          </p>
        </div>
        <div className="adm-page-actions">
          <Link to="/admin/products" className="adm-btn adm-btn-secondary">
            ← Back to Products
          </Link>
        </div>
      </div>

      <div className="adm-dashboard-card" style={{ maxWidth: "700px" }}>
        <div className="adm-card-header">
          <h3 className="adm-card-title">Product Information</h3>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {message && (
            <div className="adm-alert adm-alert-error">
              <span>{message}</span>
            </div>
          )}

          <div className="adm-form-group">
            <label className="adm-form-label">Product Name *</label>
            <input
              type="text"
              className="adm-form-input"
              placeholder="e.g. Apple MacBook Air M2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Category *</label>
              <select
                className="adm-form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                placeholder="e.g. Apple"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Price (₹) *</label>
              <input
                type="number"
                className="adm-form-input"
                placeholder="Price (max ₹25,000)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                max="25000"
                required
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Available Stock *</label>
              <input
                type="number"
                className="adm-form-input"
                placeholder="Available stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Image URL *</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="url"
                className="adm-form-input"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              {image && (
                <img
                  src={image}
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

          <div className="adm-form-group">
            <label className="adm-form-label">Description</label>
            <textarea
              className="adm-form-textarea"
              placeholder="Product description and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <Link to="/admin/products" className="adm-btn adm-btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="adm-btn adm-btn-action-primary"
              disabled={submitting}
            >
              {submitting ? "Saving to Database..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProduct;
