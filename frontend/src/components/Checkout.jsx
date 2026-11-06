import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getApiUrl } from "../config/api";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useContext(CartContext);

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);

  /* =====================================================
     PAYMENT CANCELLATION & RETRY STATE
     - paymentState: "idle" | "verifying" | "not_completed"
     - pendingOrderId: Existing ShopEase order in MongoDB
  ===================================================== */
  const [paymentState, setPaymentState] = useState("idle");
  const [failureReason, setFailureReason] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState("");
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [showEditAddress, setShowEditAddress] = useState(false);

  /* =====================================================
     1. LOAD CART ITEMS
  ===================================================== */
  useEffect(() => {
    try {
      const savedCheckoutItems = JSON.parse(
        localStorage.getItem("checkoutItems")
      );

      if (
        savedCheckoutItems &&
        Array.isArray(savedCheckoutItems) &&
        savedCheckoutItems.length > 0
      ) {
        setCheckoutItems(savedCheckoutItems);
      } else if (cartItems && cartItems.length > 0) {
        setCheckoutItems(cartItems);
      }
    } catch (error) {
      console.error("Checkout items error:", error);
    }
  }, [cartItems]);

  /* =====================================================
     2. LOAD SAVED USER ADDRESS & CHECK RECENT PENDING ORDER
  ===================================================== */
  useEffect(() => {
    const loadAddressAndPendingOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch saved user address
        const response = await fetch(getApiUrl("/api/users/address"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.address) {
          setFullName(data.address.fullName || "");
          setPhone(data.address.phone || "");
          setAddress(data.address.address || "");
          setCity(data.address.city || "");
          setState(data.address.state || "");
          setPincode(data.address.pincode || "");
        }

        // Check if there is an active pending order in sessionStorage (e.g. after page refresh)
        const savedPendingId = sessionStorage.getItem("shopease_pending_order_id");
        if (savedPendingId) {
          try {
            const orderRes = await fetch(
              getApiUrl(`/api/orders/pending/${savedPendingId}`),
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (orderRes.ok) {
              const orderData = await orderRes.json();
              if (orderData.order) {
                // If order was already paid, clear and redirect to success
                if (orderData.order.isPaid) {
                  sessionStorage.removeItem("shopease_pending_order_id");
                  navigate("/order-success", {
                    replace: true,
                    state: { order: orderData.order },
                  });
                  return;
                }

                // Order is still pending/unpaid: restore order details and show retry UI
                setPendingOrderId(orderData.order._id);
                setPendingOrderData(orderData.order);
                setPaymentState("not_completed");

                if (orderData.order.shippingAddress) {
                  const sa = orderData.order.shippingAddress;
                  if (sa.fullName) setFullName(sa.fullName);
                  if (sa.phone) setPhone(sa.phone);
                  if (sa.address) setAddress(sa.address);
                  if (sa.city) setCity(sa.city);
                  if (sa.state) setState(sa.state);
                  if (sa.pincode) setPincode(sa.pincode);
                }

                if (orderData.order.items && orderData.order.items.length > 0) {
                  setCheckoutItems(
                    orderData.order.items.map((it) => ({
                      _id: it.product?._id || it.product,
                      product: it.product,
                      quantity: it.quantity,
                      name: it.product?.name,
                      price: it.product?.price,
                      image: it.product?.image,
                    }))
                  );
                }
              }
            }
          } catch (e) {
            console.error("Error restoring pending order:", e);
          }
        }
      } catch (error) {
        console.error("Load address error:", error);
      }
    };

    loadAddressAndPendingOrder();
  }, [navigate]);

  /* =====================================================
     3. CALCULATE ORDER TOTAL
  ===================================================== */
  const orderTotal = useMemo(() => {
    if (pendingOrderData?.totalPrice) {
      return pendingOrderData.totalPrice;
    }
    return checkoutItems.reduce((sum, item) => {
      const price = Number(item.price || item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);
  }, [checkoutItems, pendingOrderData]);

  /* =====================================================
     4. LOAD RAZORPAY SDK SCRIPT DYNAMICALLY
  ===================================================== */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.getElementById("razorpay-checkout-script");
      if (existingScript) {
        if (typeof window !== "undefined" && window.Razorpay) {
          resolve(true);
          return;
        }
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* =====================================================
     5. CORE RAZORPAY OPENER & VERIFIER
     Reuses existing pending ShopEase order without duplicates.
  ===================================================== */
  const launchRazorpayForOrder = async (existingOrderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      setMessage("Razorpay checkout failed to load. Please verify your internet connection.");
      setLoading(false);
      setRetrying(false);
      return;
    }

    /* ---------------------------------------------
       Request fresh Razorpay gateway order linked
       to the exact ShopEase order in MongoDB
    --------------------------------------------- */
    const paymentResponse = await fetch(getApiUrl("/api/payments/create-order"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: existingOrderId,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      // Check if order was already paid
      if (paymentData.message && paymentData.message.includes("already been paid")) {
        sessionStorage.removeItem("shopease_pending_order_id");
        navigate("/order-success");
        return;
      }
      throw new Error(paymentData.message || "Failed to initialize payment gateway order.");
    }

    /* ---------------------------------------------
       Configure Razorpay Checkout Options
    --------------------------------------------- */
    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount,
      currency: paymentData.currency || "INR",
      name: "ShopEase",
      description: "ShopEase Order Payment",
      order_id: paymentData.orderId,
      prefill: {
        name: fullName.trim(),
        contact: phone.trim(),
      },
      notes: {
        address: `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
        shopeaseOrderId: existingOrderId,
      },

      /* -------------------------------------------
         PAYMENT SUCCESS HANDLER
         Never trust frontend alone: verify signature
         and confirm order status on backend.
      ------------------------------------------- */
      handler: async function (razorpayResponse) {
        try {
          setPaymentState("verifying");
          setMessage("Verifying payment security...");

          // Step 1: Verify cryptographic signature on backend
          const verifyResponse = await fetch(getApiUrl("/api/payments/verify"), {
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

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            setFailureReason(verifyData.message || "Cryptographic signature verification failed.");
            setPaymentState("not_completed");
            setMessage("Payment verification failed. Please try again.");
            setLoading(false);
            setRetrying(false);
            return;
          }

          // Step 2: Confirm existing order in MongoDB to Paid/Processing
          setMessage("Payment verified. Confirming your order...");
          const confirmResponse = await fetch(getApiUrl("/api/orders/confirm-payment"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: existingOrderId,
              paymentId: razorpayResponse.razorpay_payment_id,
              razorpayOrderId: razorpayResponse.razorpay_order_id,
            }),
          });

          const confirmData = await confirmResponse.json();

          if (!confirmResponse.ok) {
            setFailureReason(confirmData.message || "Failed to update order status.");
            setPaymentState("not_completed");
            setMessage("Payment succeeded but order confirmation failed. Contact support.");
            setLoading(false);
            setRetrying(false);
            return;
          }

          const finalizedOrder = confirmData.order;

          // Step 3: Cleanup session & cart upon confirmed success
          sessionStorage.removeItem("shopease_pending_order_id");
          localStorage.removeItem("checkoutItems");
          localStorage.setItem("latestOrder", JSON.stringify(finalizedOrder));

          if (typeof clearCart === "function") {
            clearCart();
          }

          // Step 4: Navigate to Order Success page
          navigate("/order-success", {
            replace: true,
            state: { order: finalizedOrder },
          });
        } catch (err) {
          console.error("Payment confirmation error:", err);
          setFailureReason("An unexpected error occurred during confirmation.");
          setPaymentState("not_completed");
          setMessage("Payment verification failed. Please try paying again.");
          setLoading(false);
          setRetrying(false);
        }
      },

      /* -------------------------------------------
         PAYMENT CANCELLATION / DISMISSAL
         Customer closed popup or cancelled.
         Never clear cart or mark order as permanently failed.
      ------------------------------------------- */
      modal: {
        ondismiss: function () {
          setLoading(false);
          setRetrying(false);
          setFailureReason("");
          setPaymentState("not_completed");
        },
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const razorpay = new window.Razorpay(options);

    /* -------------------------------------------
       PAYMENT FAILED EVENT
       Captures bank or UPI failure details safely.
    ------------------------------------------- */
    razorpay.on("payment.failed", function (response) {
      console.error("Razorpay payment failed:", response);
      const reason =
        response.error?.description ||
        response.error?.reason ||
        "Payment was declined by the bank or payment provider.";
      setFailureReason(reason);
      setPaymentState("not_completed");
      setLoading(false);
      setRetrying(false);
    });

    razorpay.open();
  };

  /* =====================================================
     6. INITIAL PLACE ORDER (CREATES PENDING ORDER ONCE)
  ===================================================== */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setMessage("Please fill all delivery details.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      let targetOrderId = pendingOrderId;

      /* ---------------------------------------------
         If no pending order exists yet, create one
         in MongoDB with status: "Pending", isPaid: false
      --------------------------------------------- */
      if (!targetOrderId) {
        const orderResponse = await fetch(getApiUrl("/api/orders"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: checkoutItems.map((item) => ({
              product: item._id || item.product?._id || item.product,
              quantity: item.quantity || 1,
            })),
            paymentMethod: "Razorpay",
            shippingAddress: {
              fullName: fullName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
            },
          }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          setMessage(orderData.message || "Failed to create order record.");
          setLoading(false);
          return;
        }

        targetOrderId = orderData.order._id;
        setPendingOrderId(targetOrderId);
        setPendingOrderData(orderData.order);
        sessionStorage.setItem("shopease_pending_order_id", targetOrderId);
      }

      // Launch Razorpay using this pending order
      await launchRazorpayForOrder(targetOrderId);
    } catch (error) {
      console.error("Place order error:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  /* =====================================================
     7. RETRY PAYMENT ACTION
     Debounced: strictly reuses the existing pending order.
  ===================================================== */
  const handleRetryPayment = async () => {
    if (retrying || loading) return;
    if (!pendingOrderId) {
      // If pendingOrderId lost, trigger normal place order
      setPaymentState("idle");
      return;
    }

    setRetrying(true);
    setMessage("");

    try {
      await launchRazorpayForOrder(pendingOrderId);
    } catch (err) {
      console.error("Retry payment error:", err);
      setMessage(err.message || "Could not re-initiate payment. Please try again.");
      setRetrying(false);
    }
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  return (
    <section className="checkout-section">
      <div className="checkout-container">
        {/* ===================================================
            A. PAYMENT NOT COMPLETED / CANCELLATION STATE
        =================================================== */}
        {paymentState === "not_completed" ? (
          <div className="payment-status-card">
            {/* STATUS ICON */}
            <div className="payment-status-icon-wrap">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* HEADING & REASSURING MESSAGE */}
            <h2 className="payment-status-title">Payment Not Completed</h2>
            <p className="payment-status-desc">
              Your payment was not completed. Don't worry! Your order details are safe.
              You can try paying again or continue shopping.
            </p>

            {/* SPECIFIC FAILURE REASON (IF REPORTED BY GATEWAY) */}
            {failureReason && (
              <div className="payment-failure-reason-box">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{failureReason}</span>
              </div>
            )}

            {/* ORDER SUMMARY PILL */}
            <div className="payment-order-summary-pill">
              <div>
                <div className="payment-order-summary-label">Order Total</div>
                <div className="payment-order-summary-val">
                  {formatCurrency(orderTotal)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="payment-order-summary-label">Items</div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#334155",
                    marginTop: "2px",
                  }}
                >
                  {checkoutItems.length} Product{checkoutItems.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE IF ANY */}
            {message && (
              <p className="checkout-message" style={{ marginBottom: "16px", width: "100%", maxWidth: "480px" }}>
                {message}
              </p>
            )}

            {/* ACTION BUTTONS (RETRY PAYMENT, BACK TO STORE, VIEW CART) */}
            <div className="payment-actions-container">
              {/* 1. PROMINENT RETRY PAYMENT BUTTON */}
              <button
                type="button"
                className="payment-retry-btn"
                onClick={handleRetryPayment}
                disabled={retrying || loading}
              >
                {retrying ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span>Re-opening Razorpay...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    <span>Retry Payment</span>
                  </>
                )}
              </button>

              {/* SECONDARY ROW: BACK TO STORE & VIEW CART */}
              <div className="payment-secondary-actions-row">
                {/* 2. BACK TO STORE */}
                <button
                  type="button"
                  className="payment-secondary-nav-btn"
                  onClick={() => navigate("/")}
                  disabled={retrying}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Back to Store</span>
                </button>

                {/* 3. VIEW CART */}
                <button
                  type="button"
                  className="payment-secondary-nav-btn"
                  onClick={() => navigate("/cart")}
                  disabled={retrying}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>View Cart</span>
                </button>
              </div>

              {/* OPTION TO EDIT DELIVERY DETAILS */}
              <button
                type="button"
                className="payment-toggle-details-link"
                onClick={() => setShowEditAddress(!showEditAddress)}
              >
                {showEditAddress
                  ? "Hide Delivery Details ▲"
                  : "Need to change delivery details? Edit details ▼"}
              </button>
            </div>

            {/* EXPANDABLE ADDRESS REVIEW / EDIT ACCORDION */}
            {showEditAddress && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e2e8f0",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#1e1b4b" }}>
                  Delivery Information
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <textarea
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="2"
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===================================================
              B. STANDARD INITIAL CHECKOUT FORM
          =================================================== */
          <>
            <div className="checkout-header">
              <div className="checkout-icon">📦</div>
              <h2>Complete Your Order</h2>
              <p className="checkout-subtitle">
                Enter your delivery details and place your order
              </p>
              {typeof window !== "undefined" &&
                window.location.search.includes("direct=true") && (
                  <div
                    style={{
                      margin: "12px auto 0",
                      padding: "10px 16px",
                      backgroundColor: "rgba(121, 40, 202, 0.12)",
                      border: "1px solid rgba(121, 40, 202, 0.35)",
                      borderRadius: "8px",
                      color: "#d4b3ff",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      maxWidth: "480px",
                      textAlign: "center",
                    }}
                  >
                    ⚡ Buy Now Mode: Confirm your delivery details to complete
                    Razorpay payment.
                  </div>
                )}
            </div>

            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="checkout-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Complete Address</label>
                <textarea
                  placeholder="House No., Street, Area, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="checkout-row">
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="Enter your state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>

              {/* ORDER SUMMARY */}
              <div className="checkout-total">
                <div style={{ fontSize: "14px", color: "#6b21a8", marginBottom: "4px" }}>
                  Total Payable Amount ({checkoutItems.length} item{checkoutItems.length > 1 ? "s" : ""})
                </div>
                <h3>{formatCurrency(orderTotal)}</h3>
              </div>

              {message && <p className="checkout-message">{message}</p>}

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading || paymentState === "verifying"}
              >
                {paymentState === "verifying"
                  ? "Verifying Payment..."
                  : loading
                  ? "Opening Razorpay..."
                  : "Pay with Razorpay ✓"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default Checkout;
