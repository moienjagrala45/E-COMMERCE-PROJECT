import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 46,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        navigate("/admin");
        return;
      }

      const response = await fetch(getApiUrl("/api/admin/stats"), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard statistics");
      }

      setStats({
        totalProducts: data.totalProducts ?? 46,
        totalOrders: data.totalOrders ?? 0,
        totalCustomers: data.totalCustomers ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err.message || "Could not retrieve store data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amt) => {
    return `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  };

  return (
    <AdminLayout active="overview" title="Dashboard">
      {/* 1. CLEAN PAGE HEADER */}
      <div className="adm-page-header" style={{ marginBottom: "24px" }}>
        <div className="adm-page-header-text">
          <h1 className="adm-page-title" style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
            Dashboard
          </h1>
        </div>
        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={fetchDashboardStats}
            disabled={loading}
            title="Refresh database data"
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
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "20px" }}>
          <span>{error}</span>
        </div>
      )}

      {/* 2. FOUR MAIN BUSINESS STATISTICS CARDS */}
      <div className="adm-metrics-grid" style={{ marginBottom: "28px" }}>
        {/* TOTAL ORDERS */}
        <Link
          to="/admin/orders"
          className="adm-metric-panel"
          style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          title="View all customer orders"
        >
          <div className="adm-metric-top">
            <span className="adm-metric-label">Total Orders</span>
            <svg
              className="adm-metric-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="adm-metric-value">
            {loading ? "..." : stats.totalOrders}
          </div>
        </Link>

        {/* TOTAL PRODUCTS */}
        <Link
          to="/admin/products"
          className="adm-metric-panel"
          style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          title="View all products"
        >
          <div className="adm-metric-top">
            <span className="adm-metric-label">Total Products</span>
            <svg
              className="adm-metric-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="adm-metric-value">
            {loading ? "..." : stats.totalProducts}
          </div>
        </Link>

        {/* REGISTERED CUSTOMERS */}
        <Link
          to="/admin/users"
          className="adm-metric-panel"
          style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          title="View registered customer accounts"
        >
          <div className="adm-metric-top">
            <span className="adm-metric-label">Registered Customers</span>
            <svg
              className="adm-metric-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            </svg>
          </div>
          <div className="adm-metric-value">
            {loading ? "..." : stats.totalCustomers}
          </div>
        </Link>

        {/* TOTAL REVENUE */}
        <Link
          to="/admin/orders"
          className="adm-metric-panel"
          style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
          title="View verified paid orders"
        >
          <div className="adm-metric-top">
            <span className="adm-metric-label">Total Revenue</span>
            <svg
              className="adm-metric-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="adm-metric-value" style={{ color: "#38bdf8" }}>
            {loading ? "..." : formatCurrency(stats.totalRevenue)}
          </div>
        </Link>
      </div>

      {/* 3. COMPACT QUICK ACTIONS */}
      <div className="adm-dashboard-card" style={{ padding: "22px 24px" }}>
        <h3 className="adm-card-title" style={{ margin: "0 0 18px 0", fontSize: "16px" }}>
          Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {/* ADD PRODUCT */}
          <Link
            to="/admin/products/add"
            className="adm-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--adm-border-subtle)",
              borderRadius: "var(--adm-radius-sm)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(168, 85, 247, 0.12)",
                color: "#c084fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text-primary)" }}>
                Add Product
              </div>
              <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                Create a new store item
              </div>
            </div>
          </Link>

          {/* MANAGE PRODUCTS */}
          <Link
            to="/admin/products"
            className="adm-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--adm-border-subtle)",
              borderRadius: "var(--adm-radius-sm)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(56, 189, 248, 0.12)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text-primary)" }}>
                Manage Products
              </div>
              <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                View and edit inventory items
              </div>
            </div>
          </Link>

          {/* MANAGE ORDERS */}
          <Link
            to="/admin/orders"
            className="adm-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--adm-border-subtle)",
              borderRadius: "var(--adm-radius-sm)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(74, 222, 128, 0.12)",
                color: "#4ade80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text-primary)" }}>
                Manage Orders
              </div>
              <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                Track and fulfill customer orders
              </div>
            </div>
          </Link>

          {/* MANAGE CATEGORIES */}
          <Link
            to="/admin/categories"
            className="adm-action-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--adm-border-subtle)",
              borderRadius: "var(--adm-radius-sm)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(244, 114, 182, 0.12)",
                color: "#f472b6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text-primary)" }}>
                Manage Categories
              </div>
              <div style={{ fontSize: "12px", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                Organize store catalogue groups
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
