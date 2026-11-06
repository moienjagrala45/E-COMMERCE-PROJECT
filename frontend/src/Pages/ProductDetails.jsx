import { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { EXISTING_STORE_PRODUCTS, enrichProduct } from "../data/productsData";
import { getApiUrl } from "../config/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext) || { cartItems: [] };

  const [allProducts, setAllProducts] = useState(EXISTING_STORE_PRODUCTS);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Load product and full catalog from backend or verified store catalog
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setQuantity(1);

      // 1. Search in local catalog first
      const foundInCatalog = EXISTING_STORE_PRODUCTS.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      );

      if (foundInCatalog) {
        if (isMounted) {
          setProduct(enrichProduct ? enrichProduct(foundInCatalog) : foundInCatalog);
          setLoading(false);
        }
      }

      // 2. Fetch full catalog / item from backend if available
      try {
        const [prodRes, listRes] = await Promise.all([
          fetch(getApiUrl(`/api/products/${id}`), { cache: "no-store" }),
          fetch(getApiUrl("/api/products"), { cache: "no-store" }),
        ]);

        if (listRes.ok) {
          const listData = await listRes.json();
          if (isMounted && Array.isArray(listData) && listData.length > 0) {
            setAllProducts(listData.map(enrichProduct));
          }
        }

        if (prodRes.ok) {
          const liveData = await prodRes.json();
          if (isMounted && liveData) {
            setProduct(enrichProduct ? enrichProduct(liveData) : liveData);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to verified local catalog
      }

      // 3. If ID not found in database or catalog, show not found
      if (isMounted && !foundInCatalog) {
        setProduct(null);
        setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Set quantity based on product stock whenever product loads
  useEffect(() => {
    if (product) {
      const st =
        product.stock !== undefined && product.stock !== null
          ? Math.max(0, Number(product.stock))
          : 0;
      setQuantity(st > 0 ? 1 : 0);
    }
  }, [product?.stock, product?._id, product?.id]);

  // Show all similar products from the same category (up to 8 items, not just 4)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    const currentId = String(product._id || product.id);
    const currentCat = (product.category || "").toLowerCase();

    return allProducts
      .filter((p) => {
        const pId = String(p._id || p.id);
        const pCat = (p.category || "").toLowerCase();
        if (pId === currentId) return false;

        // Same category or closely matched
        if (pCat === currentCat) return true;
        if (currentCat.includes("fashion") && pCat.includes("fashion")) return true;
        if (currentCat.includes("phone") && pCat.includes("phone")) return true;
        if (currentCat.includes("laptop") && pCat.includes("laptop")) return true;
        if (currentCat.includes("access") && pCat.includes("access")) return true;
        return false;
      })
      .slice(0, 8); // Show up to 8 similar items
  }, [allProducts, product]);

  const specEntries = useMemo(() => {
    if (!product?.specs) return [];
    if (product.specs instanceof Map) {
      return Array.from(product.specs.entries());
    }
    if (typeof product.specs === "object") {
      return Object.entries(product.specs);
    }
    return [];
  }, [product?.specs]);

  if (loading) {
    return (
      <div className="shopease-dark-root">
        <Navbar />
        <main className="details-main">
          <div className="catalog-state-box">
            <h3>Loading product details...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shopease-dark-root">
        <Navbar />
        <main className="details-main">
          <div className="catalog-state-box">
            <h3>Product Not Found</h3>
            <p>The product you requested is currently unavailable.</p>
            <button
              type="button"
              className="catalog-reset-btn"
              onClick={() => navigate("/products")}
            >
              Browse Catalog
            </button>
          </div>
        </main>
      </div>
    );
  }

  const pId = product._id || product.id;
  const inCartQty = (cartItems || []).find((i) => (i._id || i.id) === pId)?.quantity || 0;

  // Real backend inventory stock
  const actualStock =
    product.stock !== undefined && product.stock !== null
      ? Math.max(0, Number(product.stock))
      : 0;
  const isOutOfStock = actualStock <= 0;

  // Dynamic Stock Availability Label:
  // - Show exact remaining quantity only when stock is between 1 and 5:
  //   "Only 1 left", "Only 2 left", "Only 3 left", "Only 4 left", "Only 5 left"
  // - If stock is greater than 5, show "In Stock" instead
  // - If stock is 0, show "Out of Stock"
  // - Never display a quantity greater than 5 in this availability label
  let stockAvailabilityText = "In Stock";
  let stockAvailabilityClass = "status-in";

  if (isOutOfStock) {
    stockAvailabilityText = "Out of Stock";
    stockAvailabilityClass = "status-out";
  } else if (actualStock >= 1 && actualStock <= 5) {
    stockAvailabilityText = `Only ${actualStock} left`;
    stockAvailabilityClass = "status-low";
  } else {
    stockAvailabilityText = "In Stock";
    stockAvailabilityClass = "status-in";
  }

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (isOutOfStock) return;
    if (quantity < actualStock) {
      setQuantity(quantity + 1);
    } else {
      setFeedback(`Only ${actualStock} unit${actualStock > 1 ? "s" : ""} available in stock.`);
      setTimeout(() => setFeedback(""), 2500);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setFeedback("This product is currently out of stock.");
      return;
    }

    if (quantity > actualStock) {
      setFeedback(`Only ${actualStock} unit${actualStock > 1 ? "s" : ""} available in stock.`);
      return;
    }

    if (addToCart) {
      let addedCount = 0;
      for (let i = 0; i < quantity; i++) {
        const res = addToCart(product);
        if (res && res.success === false) {
          break;
        }
        addedCount++;
      }

      if (addedCount > 0) {
        setFeedback(`Added ${addedCount} unit${addedCount > 1 ? "s" : ""} to cart successfully.`);
        setTimeout(() => setFeedback(""), 2500);
      } else {
        setFeedback(`Maximum available stock (${actualStock} units) already in cart.`);
        setTimeout(() => setFeedback(""), 2500);
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
      }
      const existing = document.getElementById("razorpay-checkout-script");
      if (existing) {
        if (typeof window !== "undefined" && window.Razorpay) {
          resolve(true);
        }
        existing.remove();
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      setFeedback("This product is currently out of stock.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      try {
        localStorage.setItem(
          "checkoutItems",
          JSON.stringify([{ ...product, quantity: quantity }])
        );
      } catch (e) {
        console.error(e);
      }
      navigate("/login", { state: { message: "Please sign in to complete your purchase" } });
      return;
    }

    setIsProcessingBuyNow(true);
    setFeedback("Connecting to secure Razorpay checkout...");

    try {
      // 1. Check user address
      const addrRes = await fetch(getApiUrl("/api/users/address"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrData = await addrRes.json();
      const addr = addrData?.address;

      if (!addr || !addr.fullName || !addr.phone || !addr.address || !addr.city || !addr.pincode) {
        try {
          localStorage.setItem(
            "checkoutItems",
            JSON.stringify([{ ...product, quantity: quantity }])
          );
        } catch (e) {}
        navigate("/checkout?direct=true");
        return;
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        navigate("/checkout?direct=true");
        return;
      }

      // 3. Create backend order
      const pBackendId = product._id || product.id;
      const orderRes = await fetch(getApiUrl("/api/payments/create-order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ product: pBackendId, quantity: quantity }],
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        try {
          localStorage.setItem(
            "checkoutItems",
            JSON.stringify([{ ...product, quantity: quantity }])
          );
        } catch (e) {}
        navigate("/checkout?direct=true");
        return;
      }

      // 4. Open Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ShopEase",
        description: `Purchase: ${product.name} (Qty: ${quantity})`,
        order_id: orderData.orderId,
        prefill: {
          name: addr.fullName,
          contact: addr.phone,
        },
        handler: async function (razorpayResponse) {
          try {
            setFeedback("Verifying payment...");
            const verifyRes = await fetch(getApiUrl("/api/payments/verify"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              setFeedback("Payment verification failed.");
              setIsProcessingBuyNow(false);
              return;
            }

            const createdRes = await fetch(getApiUrl("/api/orders"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: [{ product: pBackendId, quantity: quantity }],
                paymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                paymentMethod: "Razorpay",
                shippingAddress: {
                  fullName: addr.fullName,
                  phone: addr.phone,
                  address: addr.address,
                  city: addr.city,
                  state: addr.state || "",
                  pincode: addr.pincode,
                },
              }),
            });

            const createdOrder = await createdRes.json();
            navigate("/order-success", { replace: true, state: { order: createdOrder } });
          } catch (err) {
            console.error("Order completion error:", err);
            setFeedback("Payment recorded, finalizing order...");
          } finally {
            setIsProcessingBuyNow(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingBuyNow(false);
            setFeedback("Checkout closed.");
          },
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Buy Now error:", err);
      try {
        localStorage.setItem(
          "checkoutItems",
          JSON.stringify([{ ...product, quantity: quantity }])
        );
      } catch (e) {}
      navigate("/checkout?direct=true");
    } finally {
      setIsProcessingBuyNow(false);
    }
  };

  const formattedPrice = Number(product.price || 0).toLocaleString("en-IN");

  const hasSpecs = specEntries.length > 0;

  return (
    <div className="shopease-dark-root">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. MAIN DETAILS CONTENT */}
      <main className="details-main">
        <div className="details-container">
          {/* 3. MAIN DETAILS GRID */}
          <div className="details-grid">
          {/* LEFT: COMPLETE UNCROPPED IMAGE WITH STUDIO PRESENTATION */}
          <div className="details-image-panel">
            <div className="details-image-glow-orb"></div>
            <img
              src={
                (typeof product.image === "string" && product.image.trim()) ||
                (typeof product.imageUrl === "string" && product.imageUrl.trim()) ||
                (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0].trim()) ||
                ""
              }
              alt={product.name}
              className="details-hero-img"
              referrerPolicy="no-referrer"
            />
            {isOutOfStock && (
              <span className="details-soldout-badge">OUT OF STOCK</span>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="details-info-panel">
            {/* Category & Brand */}
            <div className="details-tag-row">
              <span className="details-category-pill">{product.category}</span>
              {product.brand && (
                <span className="details-brand-pill">{product.brand}</span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="details-title">{product.name}</h1>

            {/* Price & Real Stock Status */}
            <div className="details-price-row">
              <div className="details-price">₹{formattedPrice}</div>
              <div className={`details-stock-status ${stockAvailabilityClass}`}>
                <span className="stock-indicator-dot"></span>
                <span>{stockAvailabilityText}</span>
              </div>
            </div>

            {/* Natural Product Description */}
            <p className="details-description">
              {product.description ||
                product.shortDescription ||
                `${product.name} offers reliable performance and durable everyday construction for personal and professional use.`}
            </p>

            {/* Category-Specific Specifications */}
            {hasSpecs && (
              <div className="details-specs-container">
                <h3 className="details-specs-heading">Product Specifications</h3>
                <div className="details-specs-table">
                  {specEntries.map(([label, val]) => (
                    <div key={label} className="spec-cell">
                      <span className="spec-cell-label">{label}</span>
                      <span className="spec-cell-value">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Quantity + Action Box */}
            <div className="details-action-area">
              <div className="details-qty-row">
                <label className="details-qty-label">Quantity</label>
                <div className="details-qty-selector">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleDecreaseQty}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-value">{isOutOfStock ? 0 : quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleIncreaseQty}
                    disabled={quantity >= actualStock || isOutOfStock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className={`details-stock-label ${stockAvailabilityClass}`}>
                  <span className="stock-indicator-dot"></span>
                  <span>{stockAvailabilityText}</span>
                </span>
              </div>

              <div className="details-action-buttons">
                <button
                  type="button"
                  className="details-add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : `Add to Cart • ₹${(Number(product.price || 0) * (isOutOfStock ? 0 : quantity)).toLocaleString("en-IN")}`}
                </button>

                <button
                  type="button"
                  className="details-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isProcessingBuyNow}
                >
                  {isProcessingBuyNow ? "Opening Checkout..." : "Buy Now"}
                </button>
              </div>

              {feedback && (
                <div className="details-feedback-hint">{feedback}</div>
              )}
            </div>
          </div>
        </div>

        {/* 4. PRODUCT-RELATED RECOMMENDATIONS (SIMILAR PRODUCTS) */}
        {similarProducts.length > 0 && (
          <section className="similar-products-section">
            <div className="similar-products-header-row">
              <div>
                <span className="section-kicker">CURATED RECOMMENDATIONS</span>
                <h2 className="section-title">Similar Products</h2>
                <p className="section-subtitle">
                  More handpicked selections from {product.category} ({similarProducts.length} items available)
                </p>
              </div>
              <button
                type="button"
                className="similar-view-all-btn"
                onClick={() => {
                  navigate("/products", { state: { category: product.category } });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span>View all in {product.category}</span>
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
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            <div className="similar-products-grid">
              {similarProducts.map((simProd) => (
                <ProductCard
                  key={simProd._id || simProd.id}
                  product={simProd}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. VISUALLY SECONDARY BOTTOM BACK TO CATALOG NAVIGATION */}
        <div className="details-bottom-back-bar">
          <button
            type="button"
            className="details-bottom-back-btn"
            onClick={() => {
              navigate("/products", { state: { category: product?.category } });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to Catalog"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Catalog</span>
          </button>
        </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
