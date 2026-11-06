import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(getApiUrl("/api/orders/admin/all"), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setErrorMessage(err.message || "Failed to load orders from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Order Status filter
      if (statusFilter !== "all") {
        if ((o.status || "").toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Payment Status filter
      if (paymentFilter === "paid" && !o.isPaid) return false;
      if (paymentFilter === "unpaid" && o.isPaid) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const idMatch = String(o._id || "").toLowerCase().includes(term);
        const nameMatch = (o.shippingAddress?.fullName || o.user?.name || "")
          .toLowerCase()
          .includes(term);
        const emailMatch = (o.user?.email || "").toLowerCase().includes(term);
        const cityMatch = (o.shippingAddress?.city || "")
          .toLowerCase()
          .includes(term);
        const paymentIdMatch = (o.paymentId || "").toLowerCase().includes(term);

        if (!idMatch && !nameMatch && !emailMatch && !cityMatch && !paymentIdMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, paymentFilter, searchTerm]);

  // Update order status via PUT /api/orders/:id/status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(getApiUrl(`/api/orders/${orderId}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      showToast(`Order status updated to "${newStatus}".`);

      // Update in local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.message || "Could not update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(isoString).slice(0, 10);
    }
  };

  const getStatusPill = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return <span className="adm-status-pill success">Delivered</span>;
    if (s === "shipped") return <span className="adm-status-pill info">Shipped</span>;
    if (s === "processing") return <span className="adm-status-pill warning">Processing</span>;
    return <span className="adm-status-pill neutral">Pending</span>;
  };

  return (
    <AdminLayout active="orders" title="Orders">
      {/* PAGE HEADER */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Orders</h1>
          <p className="adm-page-subtitle">
            Manage customer orders and fulfillment ({filteredOrders.length} orders shown)
          </p>
        </div>
        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={fetchOrders}
            disabled={loading}
          >
            Refresh Orders
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
            placeholder="Search by Order ID, customer, email, payment ID..."
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

        {/* ORDER STATUS FILTER */}
        <select
          className="adm-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>

        {/* PAYMENT STATUS FILTER */}
        <select
          className="adm-filter-select"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid (Razorpay)</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="adm-dashboard-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Order ID</th>
                <th style={{ whiteSpace: "nowrap" }}>Customer</th>
                <th style={{ whiteSpace: "nowrap" }}>Date</th>
                <th style={{ whiteSpace: "nowrap" }}>Amount</th>
                <th style={{ whiteSpace: "nowrap" }}>Payment</th>
                <th style={{ whiteSpace: "nowrap" }}>Order Status</th>
                <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--adm-text-secondary)",
                    }}
                  >
                    Loading orders from database...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((o) => {
                  const shortId = String(o._id).slice(-8).toUpperCase();
                  const custName =
                    o.shippingAddress?.fullName || o.user?.name || "Customer";
                  const custEmail = o.user?.email || "—";

                  return (
                    <tr key={o._id}>
                      {/* ORDER ID */}
                      <td style={{ fontFamily: "monospace", fontWeight: 600, whiteSpace: "nowrap" }}>
                        #{shortId}
                      </td>

                      {/* CUSTOMER */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ lineHeight: 1.3 }}>
                          <div style={{ fontWeight: 600 }}>{custName}</div>
                          <div style={{ fontSize: "11px", color: "var(--adm-text-dim)" }}>
                            {custEmail}
                          </div>
                        </div>
                      </td>

                      {/* DATE */}
                      <td style={{ color: "var(--adm-text-secondary)", fontSize: "12px", whiteSpace: "nowrap" }}>
                        {formatDate(o.createdAt)}
                      </td>

                      {/* AMOUNT */}
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {formatCurrency(o.totalPrice)}
                      </td>

                      {/* PAYMENT STATUS */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        {o.isPaid ? (
                          <span className="adm-status-pill success" style={{ whiteSpace: "nowrap" }}>
                            Paid • Razorpay
                          </span>
                        ) : (
                          <span className="adm-status-pill warning" style={{ whiteSpace: "nowrap" }}>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ORDER STATUS */}
                      <td style={{ whiteSpace: "nowrap" }}>{getStatusPill(o.status)}</td>

                      {/* ACTION */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link
                          to={`/admin/orders/${o._id}`}
                          className="adm-btn adm-btn-secondary adm-btn-sm"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--adm-text-dim)",
                    }}
                  >
                    No customer orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="adm-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <div>
                <h3 className="adm-modal-title">
                  Order Details #{String(selectedOrder._id).slice(-8).toUpperCase()}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--adm-text-secondary)" }}>
                  Placed on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="adm-modal-body">
              {/* STATUS UPDATER CONTROLS */}
              <div
                style={{
                  background: "var(--adm-bg-card)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "var(--adm-text-secondary)" }}>
                    Fulfillment Status:
                  </span>
                  <div style={{ marginTop: "4px" }}>
                    {getStatusPill(selectedOrder.status)}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ fontSize: "12px", color: "var(--adm-text-secondary)" }}>
                    Change Status:
                  </label>
                  <select
                    className="adm-filter-select"
                    value={selectedOrder.status || "Pending"}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder._id, e.target.value)
                    }
                    disabled={updatingStatus}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER & DELIVERY INFORMATION */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                {/* CUSTOMER DETAILS */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--adm-border-subtle)",
                    borderRadius: "6px",
                    padding: "14px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      color: "var(--adm-text-dim)",
                      letterSpacing: "0.5px",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Customer Details
                  </h4>
                  <div style={{ fontSize: "13px", lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 600 }}>
                      {selectedOrder.shippingAddress?.fullName ||
                        selectedOrder.user?.name ||
                        "Customer"}
                    </div>
                    <div style={{ color: "var(--adm-text-secondary)" }}>
                      {selectedOrder.user?.email || "—"}
                    </div>
                    <div style={{ color: "var(--adm-text-secondary)" }}>
                      Phone: {selectedOrder.shippingAddress?.phone || "—"}
                    </div>
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--adm-border-subtle)",
                    borderRadius: "6px",
                    padding: "14px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "12px",
                      textTransform: "uppercase",
                      color: "var(--adm-text-dim)",
                      letterSpacing: "0.5px",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Shipping Destination
                  </h4>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "var(--adm-text-secondary)",
                      lineHeight: 1.45,
                    }}
                  >
                    {selectedOrder.shippingAddress?.address ? (
                      <>
                        <div>{selectedOrder.shippingAddress.address}</div>
                        <div>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state} –{" "}
                          {selectedOrder.shippingAddress.pincode}
                        </div>
                      </>
                    ) : (
                      <div>No physical delivery address recorded.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* PRODUCTS ORDERED TABLE */}
              <div>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    margin: "10px 0 8px 0",
                  }}
                >
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>

                <div
                  style={{
                    border: "1px solid var(--adm-border-card)",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Unit Price</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => {
                          const prod = item.product || {};
                          const unitPrice = prod.price || 0;
                          const lineTotal = unitPrice * (item.quantity || 1);

                          return (
                            <tr key={idx}>
                              <td>
                                <div className="adm-product-cell">
                                  {prod.image && (
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="adm-product-thumb"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  )}
                                  <div className="adm-product-cell-info">
                                    <span
                                      className="adm-product-cell-name"
                                      style={{ maxWidth: "220px" }}
                                    >
                                      {prod.name || "Product Item"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: "center", fontWeight: 600 }}>
                                {item.quantity || 1}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {formatCurrency(unitPrice)}
                              </td>
                              <td style={{ textAlign: "right", fontWeight: 600 }}>
                                {formatCurrency(lineTotal)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                            No items recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FINANCIAL & PAYMENT DETAILS */}
              <div
                style={{
                  background: "var(--adm-bg-card)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)" }}>
                    Payment Method: <strong>{selectedOrder.paymentMethod || "Razorpay"}</strong>
                  </div>
                  {selectedOrder.paymentId && (
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontFamily: "monospace",
                        color: "var(--adm-text-dim)",
                        marginTop: "2px",
                      }}
                    >
                      Payment ID: {selectedOrder.paymentId}
                    </div>
                  )}
                  {selectedOrder.razorpayOrderId && (
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontFamily: "monospace",
                        color: "var(--adm-text-dim)",
                      }}
                    >
                      Razorpay Order ID: {selectedOrder.razorpayOrderId}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)" }}>
                    Grand Total
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--adm-font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#38bdf8",
                    }}
                  >
                    {formatCurrency(selectedOrder.totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;
