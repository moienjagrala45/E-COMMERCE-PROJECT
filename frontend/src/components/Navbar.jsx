import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Logo from "./Logo";

function Navbar({ onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext) || { cartItems: [] };
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const isAuthenticated = Boolean(savedUser || token);

  // Show "Back to Admin Panel" ONLY during an explicit admin preview session
  const isPreviewMode =
    location.search.includes("preview=admin") ||
    sessionStorage.getItem("adminPreviewActive") === "true";
  const showAdminReturn = Boolean(adminToken) && isPreviewMode;

  const handleReturnToAdmin = () => {
    sessionStorage.removeItem("adminPreviewActive");
    const returnPath = sessionStorage.getItem("adminReturnPath") || "/admin/dashboard";
    navigate(returnPath);
  };

  const totalItems = (cartItems || []).reduce(
    (total, item) => total + (Number(item?.quantity) || 1),
    0
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/products", { state: { search: searchTerm.trim() } });
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  // User display name & initial
  const rawName =
    savedUser?.name ||
    savedUser?.username ||
    (savedUser?.email ? savedUser.email.split("@")[0] : "Account");
  const displayName = rawName.split(" ")[0];
  const userInitial = (displayName.charAt(0) || "U").toUpperCase();
  const userEmail = savedUser?.email || "";

  return (
    <header className="shopease-navbar">
      <div className="navbar-container">
        {/* LEFT: SUPPLIED SHOPEASE BRAND EMBLEM & WORDMARK */}
        <Logo />

        {/* DESKTOP MAIN LINKS */}
        <ul className="navbar-links">
          <li>
            <button
              type="button"
              className={`nav-link-btn ${isCurrentPath("/products") ? "active" : ""}`}
              onClick={() => navigate("/products", { state: { category: "All", search: "" } })}
            >
              Products
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`nav-link-btn ${isCurrentPath("/about") ? "active" : ""}`}
              onClick={() => navigate("/about")}
            >
              About Us
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`nav-link-btn ${isCurrentPath("/contact") ? "active" : ""}`}
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>
          </li>
        </ul>

        {/* RIGHT: SEARCH, ACCOUNT CONTROL, CART & MOBILE TOGGLE */}
        <div className="navbar-right">
          {/* BACK TO ADMIN PANEL: DISPLAYED ONLY DURING ACTIVE ADMIN PREVIEW */}
          {showAdminReturn && (
            <button
              type="button"
              className="navbar-admin-return-btn"
              onClick={handleReturnToAdmin}
              title="Return to ShopEase Admin Panel"
              style={{
                background: "rgba(147, 51, 234, 0.18)",
                border: "1px solid rgba(168, 85, 247, 0.45)",
                color: "#c084fc",
                padding: "6px 12px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "12.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Admin Panel</span>
            </button>
          )}

          {/* DESKTOP SEARCH */}
          <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>

          {/* DESKTOP SIGN IN OR ACCOUNT DROPDOWN */}
          {isAuthenticated ? (
            <div className="navbar-user-dropdown-wrap" ref={userMenuRef}>
              <button
                type="button"
                className={`navbar-user-trigger ${showUserMenu ? "active" : ""}`}
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <span className="user-avatar-circle">{userInitial}</span>
                <span className="user-display-name">{displayName}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`user-chevron-svg ${showUserMenu ? "open" : ""}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showUserMenu && (
                <div className="navbar-user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <span className="user-dropdown-label">SIGNED IN AS</span>
                    <strong className="user-dropdown-name">
                      {savedUser?.name || displayName}
                    </strong>
                    {userEmail && (
                      <span className="user-dropdown-email">{userEmail}</span>
                    )}
                  </div>
                  <div className="user-dropdown-divider" />
                  <button
                    type="button"
                    className="user-dropdown-signout-btn"
                    onClick={handleSignOut}
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
                      className="signout-icon"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="navbar-signin-btn"
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth();
                } else {
                  navigate("/login");
                }
              }}
            >
              Sign In
            </button>
          )}

          {/* VIEW CART BUTTON WITH LIVE BADGE */}
          <button
            type="button"
            className="navbar-cart-btn"
            onClick={() => navigate("/cart")}
            aria-label="View Cart"
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
              className="navbar-cart-icon"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-btn-label">View Cart</span>
            <span className="cart-count-badge">{totalItems}</span>
          </button>

          {/* MOBILE HAMBURGER TOGGLE BUTTON */}
          <button
            type="button"
            className={`navbar-mobile-toggle-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SLIDE-DOWN DRAWER MENU */}
      <div className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        {/* Full-width Search */}
        <form
          className="navbar-mobile-search-form"
          onSubmit={handleSearchSubmit}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mobile-search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="navbar-mobile-search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="mobile-search-clear-btn"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>

        {/* Mobile Navigation Links */}
        <div className="navbar-mobile-nav-list">
          <button
            type="button"
            className={`navbar-mobile-nav-item ${isCurrentPath("/") ? "active" : ""}`}
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`navbar-mobile-nav-item ${isCurrentPath("/products") ? "active" : ""}`}
            onClick={() => {
              navigate("/products", { state: { category: "All", search: "" } });
              setMobileMenuOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>All Products</span>
          </button>

          <button
            type="button"
            className={`navbar-mobile-nav-item ${isCurrentPath("/about") ? "active" : ""}`}
            onClick={() => {
              navigate("/about");
              setMobileMenuOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>About Us</span>
          </button>

          <button
            type="button"
            className={`navbar-mobile-nav-item ${isCurrentPath("/contact") ? "active" : ""}`}
            onClick={() => {
              navigate("/contact");
              setMobileMenuOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Contact Support</span>
          </button>
        </div>

        {/* Mobile Footer (Account info & Sign Out / Sign In) */}
        <div className="navbar-mobile-account-section">
          {isAuthenticated ? (
            <div className="navbar-mobile-user-card">
              <div className="navbar-mobile-user-info">
                <span className="user-avatar-circle">{userInitial}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="navbar-mobile-user-name">
                    {savedUser?.name || displayName}
                  </div>
                  {userEmail && (
                    <div className="navbar-mobile-user-email">{userEmail}</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="navbar-mobile-signout-btn"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="navbar-mobile-signin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth();
                else navigate("/login");
              }}
            >
              Sign In / Register
            </button>
          )}

          {showAdminReturn && (
            <button
              type="button"
              className="navbar-mobile-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleReturnToAdmin();
              }}
            >
              ← Return to Admin Panel
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
