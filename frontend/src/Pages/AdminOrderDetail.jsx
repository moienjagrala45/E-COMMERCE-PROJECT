import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Status update
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(getApiUrl(`/api/orders/${id}`), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Order not found or access denied.");
      }

      const data = await response.json();
      setOrder(data);
      setSelectedStatus(data.status || "Pending");
    } catch (err) {
      console.error("Fetch order detail error:", err);
      setErrorMessage(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Update Status
  const handleUpdateStatus = async () => {
    if (!order) return;
    try {
      setUpdatingStatus(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(
        getApiUrl(`/api/orders/${order._id}/status`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      setOrder((prev) => ({
        ...prev,
        status: selectedStatus,
      }));
      showToast(`Order status updated to "${selectedStatus}".`);
    } catch (err) {
      alert(err.message || "Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return "success";
    if (s === "shipped") return "info";
    if (s === "processing") return "warning";
    return "neutral";
  };

  const shortId = order?._id ? order._id.slice(-8).toUpperCase() : "";

  const calculatedSubtotal = (order?.items || []).reduce((sum, it) => {
    const unitPrice = Number(it.price || it.product?.price || 0);
    const qty = Number(it.quantity || 1);
    return sum + unitPrice * qty;
  }, 0);
  const orderSubtotal = calculatedSubtotal > 0 ? calculatedSubtotal : (order?.totalPrice || 0);

  return (
    <AdminLayout active="orders" title="Order Details">
      {/* HEADER & BREADCRUMBS */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Link
              to="/admin/orders"
              className="adm-btn adm-btn-secondary adm-btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Orders</span>
            </Link>
            <span style={{ color: "var(--adm-text-dim)" }}>/</span>
            <span style={{ color: "var(--adm-text-secondary)", fontSize: "13px", fontFamily: "monospace" }}>
              #{shortId}
            </span>
          </div>
          <h1 className="adm-page-title">Order #{shortId}</h1>
          <p className="adm-page-subtitle">
            Manage customer fulfillment, shipping address and payment reconciliation.
          </p>
        </div>
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

      {loading ? (
        <div className="adm-dashboard-card" style={{ padding: "60px", textAlign: "center", color: "var(--adm-text-secondary)" }}>
          Loading order details from database...
        </div>
      ) : order ? (
        <div className="adm-order-detail-layout">
          {/* LEFT: PURCHASED PRODUCTS & CUSTOMER INFORMATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. PURCHASED PRODUCTS SECTION */}
            <div className="adm-dashboard-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="adm-card-title">Purchased Products ({order.items?.length || 0})</h3>
                <span style={{ fontSize: "12px", color: "var(--adm-text-dim)", whiteSpace: "nowrap" }}>
                  Order Placed: {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="adm-table-wrap" style={{ border: "1px solid var(--adm-border-card)", borderRadius: "var(--adm-radius-sm)" }}>
                <table className="adm-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Product</th>
                      <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Quantity</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Unit Price</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => {
                        const prod = item.product || {};
                        const pId = prod._id || item.product;
                        const unitPrice = Number(item.price || prod.price || 0);
                        const qty = Number(item.quantity || 1);
                        const lineTotal = unitPrice * qty;

                        return (
                          <tr key={idx}>
                            <td>
                              <div className="adm-product-cell">
                                <img
                                  src={prod.image || prod.imageUrl || "/shopease-logo.png"}
                                  alt={prod.name || "Product"}
                                  className="adm-product-thumb"
                                  onError={(e) => {
                                    e.target.src = "/shopease-logo.png";
                                  }}
                                />
                                <div className="adm-product-cell-info">
                                  {pId ? (
                                    <Link
                                      to={`/admin/products/${pId}`}
                                      className="adm-product-cell-name"
                                      title="Open product in Admin Panel"
                                      style={{ textDecoration: "none" }}
                                    >
                                      {prod.name || "Purchased Product"}
                                    </Link>
                                  ) : (
                                    <span className="adm-product-cell-name">
                                      {prod.name || "Purchased Product"}
                                    </span>
                                  )}
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                                    <span className="adm-product-cell-brand">
                                      {prod.category || "General"}
                                    </span>
                                    {pId && (
                                      <span style={{ fontSize: "11px", color: "var(--adm-text-dim)", fontFamily: "monospace" }}>
                                        ID: #{String(pId).slice(-6).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: "center", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {qty}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {formatCurrency(unitPrice)}
                            </td>
                            <td style={{ textAlign: "right", fontWeight: 700, color: "var(--adm-text-primary)", whiteSpace: "nowrap" }}>
                              {formatCurrency(lineTotal)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "var(--adm-text-dim)" }}>
                          No purchased products recorded for this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. CUSTOMER INFORMATION */}
            <div className="adm-dashboard-card" style={{ padding: "24px" }}>
              <h3 className="adm-card-title" style={{ marginBottom: "16px" }}>Customer Information</h3>

              <div className="adm-two-col-grid">
                <div>
                  <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--adm-text-dim)", marginBottom: "6px", letterSpacing: "0.04em" }}>
                    Customer Account
                  </h4>
                  <div style={{ fontWeight: 600, color: "var(--adm-text-primary)", fontSize: "15px" }}>
                    {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                  </div>
                  <div style={{ color: "var(--adm-text-secondary)", fontSize: "13px", marginTop: "2px" }}>
                    <span style={{ color: "var(--adm-text-dim)" }}>Email:</span> {order.user?.email || "—"}
                  </div>
                  <div style={{ color: "var(--adm-text-secondary)", fontSize: "13px", marginTop: "2px" }}>
                    <span style={{ color: "var(--adm-text-dim)" }}>Phone:</span> {order.shippingAddress?.phone || "—"}
                  </div>
                  {order.user?._id && (
                    <Link
                      to={`/admin/customers/${order.user._id}`}
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                      style={{ marginTop: "12px", display: "inline-flex", whiteSpace: "nowrap" }}
                    >
                      View Customer Profile in Admin →
                    </Link>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--adm-text-dim)", marginBottom: "6px", letterSpacing: "0.04em" }}>
                    Shipping Address
                  </h4>
                  {order.shippingAddress ? (
                    <div style={{ color: "var(--adm-text-primary)", fontSize: "13px", lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 600 }}>{order.shippingAddress.fullName}</div>
                      <div>{order.shippingAddress.address}</div>
                      <div>
                        {order.shippingAddress.city}
                        {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
                        {order.shippingAddress.pincode ? ` - ${order.shippingAddress.pincode}` : ""}
                      </div>
                      <div style={{ color: "var(--adm-text-dim)", fontSize: "12px" }}>India</div>
                    </div>
                  ) : (
                    <div style={{ color: "var(--adm-text-dim)", fontSize: "13px" }}>
                      No shipping address recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & ORDER MANAGEMENT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 3. ORDER SUMMARY */}
            <div className="adm-dashboard-card" style={{ padding: "20px" }}>
              <h3 className="adm-card-title" style={{ marginBottom: "16px" }}>Order Summary</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Subtotal:</span>
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{formatCurrency(orderSubtotal)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Shipping Charges:</span>
                  <span style={{ color: "#4ade80", fontWeight: 600, whiteSpace: "nowrap" }}>Free</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Discount:</span>
                  <span style={{ color: "var(--adm-text-dim)", whiteSpace: "nowrap" }}>₹0</span>
                </div>

                <div style={{ height: "1px", background: "var(--adm-border-card)", margin: "4px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--adm-text-primary)" }}>Final Order Total:</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80", whiteSpace: "nowrap" }}>
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>

                <div style={{ height: "1px", background: "var(--adm-border-card)", margin: "4px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Payment Method:</span>
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{order.paymentMethod || "Razorpay"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Payment Status:</span>
                  <div>
                    {order.isPaid ? (
                      <span className="adm-status-pill success" style={{ whiteSpace: "nowrap" }}>Paid</span>
                    ) : (
                      <span className="adm-status-pill warning" style={{ whiteSpace: "nowrap" }}>Pending</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Order Status:</span>
                  <span className={`adm-status-pill ${getStatusClass(order.status)}`} style={{ whiteSpace: "nowrap" }}>
                    {order.status || "Pending"}
                  </span>
                </div>

                {order.paymentId && (
                  <div style={{ marginTop: "4px", paddingTop: "8px", borderTop: "1px dashed var(--adm-border-subtle)" }}>
                    <div style={{ color: "var(--adm-text-dim)", fontSize: "11px" }}>Payment Reference:</div>
                    <div style={{ fontFamily: "monospace", fontSize: "11.5px", color: "var(--adm-text-primary)", wordBreak: "break-all" }}>
                      {order.paymentId}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. ORDER MANAGEMENT */}
            <div className="adm-dashboard-card" style={{ padding: "20px" }}>
              <h3 className="adm-card-title" style={{ marginBottom: "16px" }}>Order Management</h3>

              <div style={{ marginBottom: "14px" }}>
                <span style={{ fontSize: "12px", color: "var(--adm-text-dim)" }}>Current Status:</span>
                <div style={{ marginTop: "4px" }}>
                  <span className={`adm-status-pill ${getStatusClass(order.status)}`} style={{ whiteSpace: "nowrap" }}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="adm-form-group" style={{ marginBottom: "14px" }}>
                <label className="adm-form-label">Update Order Status</label>
                <select
                  className="adm-form-input"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <button
                type="button"
                className="adm-btn adm-btn-action-primary"
                style={{ width: "100%", whiteSpace: "nowrap" }}
                onClick={handleUpdateStatus}
                disabled={updatingStatus || selectedStatus === order.status}
              >
                {updatingStatus ? "Updating Status..." : "Save Status"}
              </button>

              <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--adm-border-card)" }}>
                <Link
                  to="/admin/orders"
                  className="adm-btn adm-btn-secondary"
                  style={{ width: "100%", justifyContent: "center", textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default AdminOrderDetail;

