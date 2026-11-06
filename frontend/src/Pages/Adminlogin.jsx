import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import "./Admin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // If already authenticated as admin, jump straight to dashboard
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both administrator email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(getApiUrl("/api/users/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Invalid administrator credentials.");
        return;
      }

      // Check whether user has admin role
      if (!data.user || data.user.role !== "admin") {
        setErrorMessage(
          "Access denied. This account does not possess administrator privileges."
        );
        return;
      }

      // Store authenticated credentials
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      setErrorMessage(
        "Network connection error. Please verify the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        {/* HEADER */}
        <div className="adm-login-header">
          <div className="adm-login-logo-wrap">
            <div
              className="shopease-brand-logo"
              style={{ justifyContent: "center" }}
            >
              <img
                src="/shopease-logo.png"
                alt="ShopEase"
                className="brand-logo-img"
                style={{
                  height: "30px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <span className="brand-wordmark" style={{ fontSize: "20px" }}>
                <span className="wordmark-shop">Shop</span>
                <span className="wordmark-ease">Ease</span>
              </span>
            </div>
          </div>

          <h1 className="adm-login-title">Admin Sign In</h1>
          <p className="adm-login-subtitle">
            Sign in to your administrator account
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMessage && (
          <div className="adm-alert adm-alert-error" style={{ marginBottom: "18px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: "2px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM */}
        <form className="adm-login-form" onSubmit={handleAdminLogin}>
          {/* EMAIL */}
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="adm-email">
              Email Address
            </label>
            <div className="adm-form-input-wrap">
              <input
                id="adm-email"
                type="email"
                className="adm-form-input"
                placeholder="admin@shopease.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="adm-password">
              Password
            </label>
            <div className="adm-form-input-wrap">
              <input
                id="adm-password"
                type={showPassword ? "text" : "password"}
                className="adm-form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="adm-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
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
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="adm-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  width="16"
                  height="16"
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
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* RESTRAINED FOOTER */}
        <div className="adm-login-footer">
          Protected Administrator Environment • ShopEase 2026
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
