import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { enrichProduct } from "../data/productsData";

function ProductCard({ product: rawProduct }) {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useContext(CartContext) || {};

  const product = enrichProduct ? enrichProduct(rawProduct) : rawProduct;
  const productId = product._id || product.id;

  const inCartQty = getItemQuantity ? getItemQuantity(productId) : 0;

  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Source of truth: real database stock
  const actualStock = product.stock !== undefined ? Number(product.stock) : 10;
  const isOutOfStock = actualStock <= 0;
  const isMaxLimitReached = actualStock > 0 && inCartQty >= actualStock;

  // Natural inventory status
  let stockBadgeText = "In Stock";
  let stockBadgeClass = "status-in";

  if (isOutOfStock) {
    stockBadgeText = "Out of Stock";
    stockBadgeClass = "status-out";
  } else if (actualStock >= 1 && actualStock <= 5) {
    stockBadgeText = `Only ${actualStock} left`;
    stockBadgeClass = "status-low";
  } else {
    stockBadgeText = "In Stock";
    stockBadgeClass = "status-in";
  }

  const handleCardClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (isOutOfStock) {
      setFeedbackMsg("Out of Stock");
      return;
    }

    if (isMaxLimitReached) {
      setFeedbackMsg(`All ${actualStock} in cart`);
      return;
    }

    if (addToCart) {
      const result = addToCart(product);
      if (result && result.success === false) {
        if (result.reason === "MAX_LIMIT_REACHED") {
          setFeedbackMsg(`All ${actualStock} in cart`);
        } else {
          setFeedbackMsg("Could not add to cart");
        }
      } else {
        setFeedbackMsg("Added to Cart");
        setTimeout(() => setFeedbackMsg(""), 2200);
      }
    }
  };

  const formattedPrice = Number(product.price || 0).toLocaleString("en-IN");
  const imageSrc =
    (typeof product.image === "string" && product.image.trim()) ||
    (typeof product.imageUrl === "string" && product.imageUrl.trim()) ||
    (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0].trim()) ||
    "";

  return (
    <article
      className="shopease-product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      title={`View details for ${product.name}`}
    >
      {/* COMPLETE UNCROPPED IMAGE (object-fit: contain) */}
      <div className="card-image-container">
        <img
          src={imageSrc}
          alt={product.name}
          className="card-product-image"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* CARD CONTENT */}
      <div className="card-body">
        {/* Real Inventory Status */}
        <div className={`card-stock-row ${stockBadgeClass}`}>
          <span className="stock-indicator-dot"></span>
          <span className="stock-status-text">{stockBadgeText}</span>
        </div>

        {/* Product Title */}
        <h3 className="card-title" title={product.name}>
          {product.name}
        </h3>

        {/* Price & Category */}
        <div className="card-meta-row">
          <div className="card-price">₹{formattedPrice}</div>
          <span className="card-category-tag">{product.category}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          className={`card-add-btn ${
            isOutOfStock || isMaxLimitReached ? "btn-disabled" : ""
          }`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxLimitReached}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isMaxLimitReached
            ? "All in Cart"
            : feedbackMsg || "Add to Cart"}
        </button>

        {feedbackMsg && feedbackMsg !== "Added to Cart" && (
          <div className="card-feedback-text">{feedbackMsg}</div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
