import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { enrichProduct } from "../data/productsData";

function ProductCard({ product: rawProduct }) {
  const { addToCart, getItemQuantity } = useContext(CartContext);

  const product = enrichProduct(rawProduct);
  const productId = product._id || product.id;

  const inCartQty = getItemQuantity(productId);
  const isMaxLimitReached = inCartQty >= 2;

  const [stockMessage, setStockMessage] = useState("");
  const [checkingStock, setCheckingStock] = useState(false);

  const handleAddToCart = async () => {
    // 1. Check local cart limit: maximum 2 units per customer
    if (inCartQty >= 2) {
      setStockMessage("OUT OF STOCK");
      return;
    }

    setCheckingStock(true);

    try {
      // 2. Check live backend stock if ID is available
      if (product._id) {
        const response = await fetch(
          `https://e-commerce-project-backend-vpdz.onrender.com/api/products/${product._id}`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const latestProduct = await response.json();
          if (
            latestProduct.stock !== undefined &&
            Number(latestProduct.stock) <= 0
          ) {
            setStockMessage("OUT OF STOCK");
            return;
          }
        }
      }

      // 3. Add to cart
      const result = addToCart(product);

      if (!result.success) {
        setStockMessage("OUT OF STOCK");
      } else {
        setStockMessage("");
      }
    } catch (error) {
      console.error("Stock check error:", error);
      // Fallback add if backend network is slow
      const result = addToCart(product);
      if (!result.success) {
        setStockMessage("OUT OF STOCK");
      }
    } finally {
      setCheckingStock(false);
    }
  };

  const isOutOfStock =
    isMaxLimitReached ||
    stockMessage === "OUT OF STOCK" ||
    (product.stock !== undefined && Number(product.stock) <= 0);

  return (
    <div className="product-card-enhanced">
      {/* ================= SECTION 1: PRODUCT DETAILS ================= */}
      <div className="product-details-container">
        {/* IMAGE WRAPPER */}
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image-img"
            loading="lazy"
          />
          <span className="product-category-pill">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="product-soldout-ribbon">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* DETAILS BODY */}
        <div className="product-body-content">
          <div className="product-header-info">
            <h3 className="product-title-heading">
              {product.name}
            </h3>
            <div className="product-price-tag">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>
          </div>

          {/* SHORT PRODUCT DESCRIPTION */}
          <p className="product-short-description">
            {product.shortDescription}
          </p>

          {/* KEY FEATURES & SPECIFICATIONS */}
          <div className="product-specs-card">
            <h4 className="product-specs-title">
              Key Features & Specifications
            </h4>
            <ul className="product-features-list">
              {product.features &&
                product.features.map((feature, idx) => (
                  <li key={idx} className="product-feature-item">
                    <span className="feature-check-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* USEFUL DETAILS / HIGHLIGHTS */}
          {product.highlights && (
            <div className="product-highlights-row">
              {product.highlights.map((highlight, idx) => (
                <span key={idx} className="highlight-tag">
                  • {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= VISUAL SEPARATION DIVIDER ================= */}
      <div className="product-card-divider" />

      {/* ================= SECTION 2: ADD TO CART ACTION ================= */}
      <div className="product-action-container">
        {/* STOCK / QUANTITY STATUS INDICATOR */}
        <div className="product-cart-meta">
          <span className="cart-limit-notice">
            Quantity limit: Max 2 units
          </span>
          {inCartQty > 0 && (
            <span className="in-cart-indicator">
              In Cart: {inCartQty}/2
            </span>
          )}
        </div>

        {/* OUT OF STOCK MESSAGE IN BOLD RED COLOR */}
        {(isMaxLimitReached || stockMessage) && (
          <div
            className="out-of-stock-alert"
            role="alert"
            style={{
              color: "#dc2626",
              backgroundColor: "#fef2f2",
              border: "1px solid #f87171",
              borderRadius: "6px",
              padding: "10px 14px",
              marginBottom: "12px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            ❌ OUT OF STOCK
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#b91c1c",
                marginTop: "3px",
              }}
            >
              {isMaxLimitReached
                ? "You already have the maximum 2 units of this product in your cart."
                : "This item is currently out of stock."}
            </div>
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          className={`add-cart-action-btn ${
            isOutOfStock ? "btn-out-of-stock" : ""
          }`}
          onClick={handleAddToCart}
          disabled={checkingStock}
          aria-label={
            isOutOfStock
              ? `Out of stock for ${product.name}`
              : `Add ${product.name} to Cart`
          }
        >
          {checkingStock
            ? "Checking Stock..."
            : isMaxLimitReached
            ? "OUT OF STOCK (Limit Reached)"
            : isOutOfStock
            ? "OUT OF STOCK"
            : inCartQty === 1
            ? "Add 2nd Unit to Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;