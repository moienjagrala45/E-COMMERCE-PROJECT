import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext) || { cartItems: [] };

  const getProductName = (item) => {
    return item?.name || item?.product?.name || "Product";
  };

  const getProductPrice = (item) => {
    return Number(item?.price ?? item?.product?.price ?? 0);
  };

  const getProductImage = (item) => {
    return item?.image || item?.product?.image || "/cat-accessories.png";
  };

  const getProductCategory = (item) => {
    return item?.category || item?.product?.category || "";
  };

  const totalItemCount = (cartItems || []).reduce(
    (acc, item) => acc + (Number(item?.quantity) || 1),
    0
  );

  // EMPTY CART STATE
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="shopease-dark-root">
        <Navbar />
        <main className="cart-page-wrapper">
          <div className="cart-empty-box">
            <div className="cart-empty-icon-wrap">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h1 className="cart-empty-title">Your cart is empty</h1>
            <p className="cart-empty-subtitle">
              Explore tech, fashion and everyday essentials to find what you need.
            </p>
            <button
              type="button"
              className="cart-empty-cta-btn"
              onClick={() => navigate("/products")}
            >
              Explore Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + getProductPrice(item) * Number(item?.quantity || 1),
    0
  );

  const handleProceedToCheckout = () => {
    try {
      localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
      navigate("/checkout");
    } catch (error) {
      console.error("Checkout navigation error:", error);
    }
  };

  return (
    <div className="shopease-dark-root">
      <Navbar />

      <main className="cart-page-wrapper">
        {/* HEADER AREA */}
        <div className="cart-header-area">
          <h1 className="cart-main-heading">Shopping Cart</h1>
          <p className="cart-items-count-text">
            {totalItemCount} {totalItemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* 2-COLUMN E-COMMERCE LAYOUT */}
        <div className="cart-layout-grid">
          {/* LEFT: CART ITEMS (65-70%) */}
          <div className="cart-items-column">
            {cartItems.map((item, index) => {
              const productName = getProductName(item);
              const productPrice = getProductPrice(item);
              const productImage = getProductImage(item);
              const productCategory = getProductCategory(item);
              const quantity = Number(item.quantity || 1);
              const itemTotal = productPrice * quantity;
              const itemId = item._id || item.id || index;

              return (
                <div className="cart-item-card" key={itemId}>
                  {/* 1. THUMBNAIL (ASPECT RATIO PRESERVED, CONTAIN) */}
                  <div className="cart-item-thumb-box">
                    <img
                      src={productImage}
                      alt={productName}
                      className="cart-item-thumb-img"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* 2. PRODUCT DETAILS */}
                  <div className="cart-item-details">
                    {productCategory && (
                      <span className="cart-item-category">{productCategory}</span>
                    )}
                    <h3 className="cart-item-name">{productName}</h3>
                    <p className="cart-item-unit-price">
                      ₹{productPrice.toLocaleString("en-IN")} each
                    </p>
                  </div>

                  {/* 3, 4, 5. ACTIONS: QUANTITY CONTROLS, TOTAL & REMOVE */}
                  <div className="cart-item-mobile-actions">
                    <div className="cart-qty-control">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => decreaseQuantity(item._id || item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => increaseQuantity(item._id || item.id)}
                        disabled={quantity >= (item.stock !== undefined ? Number(item.stock) : 99)}
                        aria-label="Increase quantity"
                        title={
                          quantity >= (item.stock !== undefined ? Number(item.stock) : 99)
                            ? "Maximum available stock reached"
                            : "Add more"
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item._id || item.id)}
                      aria-label={`Remove ${productName} from cart`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: ORDER SUMMARY (30-35%) */}
          <aside className="cart-summary-sidebar">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>

              <div className="cart-summary-row">
                <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-row total-row">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="button"
                className="cart-checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
