import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(getApiUrl(`/api/users/admin/${id}`), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Customer profile not found or access denied.");
      }

      const data = await response.json();
      setCustomer(data);
    } catch (err) {
      console.error("Fetch customer detail error:", err);
      setErrorMessage(err.message || "Failed to load customer profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
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

  const initial = (customer?.name?.charAt(0) || customer?.email?.charAt(0) || "U").toUpperCase();

  return (
    <AdminLayout active="users" title="Customer Profile">
      {/* HEADER & BREADCRUMBS */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Link
              to="/admin/customers"
              className="adm-btn adm-btn-secondary adm-btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Customers</span>
            </Link>
            <span style={{ color: "var(--adm-text-dim)" }}>/</span>
            <span style={{ color: "var(--adm-text-secondary)", fontSize: "13px" }}>
              {customer?.name || "Customer Profile"}
            </span>
          </div>
          <h1 className="adm-page-title">{customer?.name || "Customer Profile"}</h1>
          <p className="adm-page-subtitle">
            Review customer registration history, total lifetime value and placed orders.
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
          Loading customer profile from database...
        </div>
      ) : customer ? (
        <div className="adm-customer-detail-layout">
          {/* LEFT: CUSTOMER PROFILE CARD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="adm-dashboard-card" style={{ padding: "24px", textAlign: "center" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                  color: "#ffffff",
                  fontSize: "28px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 14px rgba(168, 85, 247, 0.35)",
                }}
              >
                {initial}
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--adm-text-primary)", margin: 0 }}>
                {customer.name}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--adm-text-secondary)", marginTop: "4px", marginBottom: "14px" }}>
                {customer.email}
              </p>

              <div>
                {customer.role === "admin" ? (
                  <span className="adm-status-pill info">Administrator</span>
                ) : (
                  <span className="adm-status-pill success">Verified Customer</span>
                )}
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--adm-border-card)", textAlign: "left", fontSize: "12.5px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ color: "var(--adm-text-dim)" }}>User ID: </span>
                  <span style={{ fontFamily: "monospace", color: "var(--adm-text-primary)" }}>{customer._id}</span>
                </div>
                <div>
                  <span style={{ color: "var(--adm-text-dim)" }}>Member Since: </span>
                  <span style={{ color: "var(--adm-text-primary)" }}>
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "Early User"}
                  </span>
                </div>
              </div>
            </div>

            {/* LIFETIME METRICS */}
            <div className="adm-dashboard-card" style={{ padding: "20px" }}>
              <h3 className="adm-card-title" style={{ marginBottom: "14px" }}>Account Activity</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Total Orders:</span>
                  <span style={{ fontWeight: 600, color: "var(--adm-text-primary)" }}>
                    {customer.orderCount || customer.orders?.length || 0}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--adm-text-secondary)" }}>Lifetime Spend:</span>
                  <span style={{ fontWeight: 700, color: "#4ade80" }}>
                    {formatCurrency(customer.totalSpent || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER HISTORY */}
          <div className="adm-dashboard-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="adm-card-title">Order History ({customer.orders?.length || 0})</h3>
            </div>

            {customer.orders && customer.orders.length > 0 ? (
              <div style={{ border: "1px solid var(--adm-border-card)", borderRadius: "var(--adm-radius-sm)", overflow: "hidden" }}>
                <table className="adm-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((o) => {
                      const shortOId = o._id.slice(-8).toUpperCase();
                      return (
                        <tr key={o._id}>
                          <td style={{ fontFamily: "monospace", fontWeight: 600 }}>#{shortOId}</td>
                          <td style={{ color: "var(--adm-text-secondary)", fontSize: "12.5px" }}>
                            {formatDate(o.createdAt)}
                          </td>
                          <td>{o.items?.length || 1} item(s)</td>
                          <td style={{ fontWeight: 600 }}>{formatCurrency(o.totalPrice)}</td>
                          <td>
                            {o.isPaid ? (
                              <span className="adm-status-pill success">Paid</span>
                            ) : (
                              <span className="adm-status-pill warning">Pending</span>
                            )}
                          </td>
                          <td>
                            <span className={`adm-status-pill ${getStatusClass(o.status)}`}>
                              {o.status || "Pending"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <Link
                              to={`/admin/orders/${o._id}`}
                              className="adm-btn adm-btn-secondary adm-btn-sm"
                            >
                              View Order Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--adm-text-dim)", fontSize: "13.5px" }}>
                No purchases recorded for this customer yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default AdminCustomerDetail;

