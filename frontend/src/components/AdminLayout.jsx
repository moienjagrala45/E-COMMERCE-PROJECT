import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Pages/Admin.css";

function AdminLayout({ children, active = "overview", title = "Dashboard", subtitle = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse adminUser:", err);
      }
    }
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      path: "/admin/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Products",
      path: "/admin/products",
      badge: "46",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      id: "categories",
      label: "Categories",
      path: "/admin/categories",
      badge: "4",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Customers",
      path: "/admin/users",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "inventory",
      label: "Inventory",
      path: "/admin/inventory",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      path: "/admin/settings",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="adm-nav-icon">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const adminName = adminUser?.name || "Administrator";
  const adminEmail = adminUser?.email || "admin@shopease.com";
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className={`adm-layout ${collapsed ? "collapsed" : ""}`}>
      {/* MOBILE DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          className="adm-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`adm-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* BRAND LOGO AT TOP */}
        <div className="adm-sidebar-top">
          <Link to="/admin/dashboard" className="adm-sidebar-brand">
            <img
              src="/shopease-logo.png"
              alt="ShopEase"
              style={{
                height: "26px",
                width: "auto",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            {!collapsed && (
              <div className="adm-sidebar-brand-text">
                <span className="adm-sidebar-title">
                  Shop<span className="ease-gradient">Ease</span>
                </span>
                <span className="adm-sidebar-subtitle">Store Management</span>
              </div>
            )}
          </Link>

          <button
            type="button"
            className="adm-sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {collapsed ? (
                <polyline points="13 17 18 12 13 7" />
              ) : (
                <polyline points="11 17 6 12 11 7" />
              )}
            </svg>
          </button>

          <button
            type="button"
            className="adm-mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation drawer"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="adm-sidebar-nav">
          {!collapsed && <span className="adm-nav-section-label">Navigation</span>}

          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`adm-nav-item ${active === item.id ? "active" : ""}`}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="adm-nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* SIDEBAR FOOTER (USER & LOGOUT) */}
        <div className="adm-sidebar-footer">
          {!collapsed ? (
            <>
              <div className="adm-user-profile-chip">
                <div className="adm-user-avatar">{initials}</div>
                <div className="adm-user-info">
                  <span className="adm-user-name" title={adminName}>
                    {adminName}
                  </span>
                  <span className="adm-user-role">Administrator</span>
                </div>
              </div>

              <button
                type="button"
                className="adm-logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="adm-sidebar-toggle-btn"
              onClick={() => setShowLogoutConfirm(true)}
              title="Sign Out"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="adm-main-wrapper">
        {/* TOP COMPACT HEADER */}
        <header className="adm-header">
          <div className="adm-header-left">
            <button
              type="button"
              className="adm-mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <div className="adm-header-right">
            <button
              type="button"
              className="adm-store-quick-link"
              title="Preview customer-facing live store"
              onClick={() => {
                sessionStorage.setItem("adminPreviewActive", "true");
                sessionStorage.setItem("adminReturnPath", location.pathname);
                navigate("/?preview=admin");
              }}
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>View Store</span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="adm-content-container">
          {children}
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="adm-modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Sign Out Confirmation</h3>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ✕
              </button>
            </div>
            <div className="adm-modal-body">
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--adm-text-secondary)" }}>
                Are you sure you want to end your administrator session? You will be returned to the admin sign-in screen.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-danger"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;

