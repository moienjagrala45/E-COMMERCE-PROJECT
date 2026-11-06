import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminSettings() {
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState(null);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse adminUser:", err);
      }
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    try {
      setSubmittingPassword(true);
      const adminToken = localStorage.getItem("adminToken");

      const response = await fetch(getApiUrl("/api/users/change-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPasswordSuccess("Your administrator password has been updated securely.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError(err.message || "Could not update password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of your administrator account?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin");
    }
  };

  return (
    <AdminLayout active="settings" title="Settings">
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Settings</h1>
          <p className="adm-page-subtitle">
            Admin account profile, security, and store environment status.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px" }}>
        {/* 1. ADMINISTRATOR PROFILE */}
        <div className="adm-settings-section">
          <div className="adm-settings-header">
            <h3 className="adm-settings-title">Administrator Profile</h3>
            <p className="adm-settings-desc">
              Your verified store administrator credentials.
            </p>
          </div>

          <div className="adm-two-col-grid">
            <div>
              <label className="adm-form-label">Full Name</label>
              <div
                style={{
                  background: "var(--adm-bg-input)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "13.5px",
                  color: "var(--adm-text-primary)",
                  fontWeight: 600,
                }}
              >
                {adminUser?.name || "Moien"}
              </div>
            </div>

            <div>
              <label className="adm-form-label">Administrator Email</label>
              <div
                style={{
                  background: "var(--adm-bg-input)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "13.5px",
                  color: "var(--adm-text-primary)",
                }}
              >
                {adminUser?.email || "moienjagrala45@gmail.com"}
              </div>
            </div>

            <div>
              <label className="adm-form-label">System Role</label>
              <div
                style={{
                  background: "var(--adm-bg-input)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "var(--adm-accent-cyan)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Store Administrator</span>
                <span style={{ fontSize: "11px", color: "var(--adm-text-dim)" }}>
                  (Full Permissions)
                </span>
              </div>
            </div>

            <div>
              <label className="adm-form-label">Account Security</label>
              <div
                style={{
                  background: "var(--adm-bg-input)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: "#34d399",
                  fontWeight: 600,
                }}
              >
                Protected (Single Authorized Root)
              </div>
            </div>
          </div>
        </div>

        {/* 2. PASSWORD MANAGEMENT */}
        <div className="adm-settings-section">
          <div className="adm-settings-header">
            <h3 className="adm-settings-title">Security & Password</h3>
            <p className="adm-settings-desc">
              Update your administrator password to maintain store account protection.
            </p>
          </div>

          {passwordSuccess && (
            <div className="adm-alert adm-alert-success">
              <span>✓ {passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="adm-alert adm-alert-error">
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="adm-form-group">
              <label className="adm-form-label">Current Password *</label>
              <input
                type="password"
                className="adm-form-input"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-form-label">New Password *</label>
                <input
                  type="password"
                  className="adm-form-input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Confirm New Password *</label>
                <input
                  type="password"
                  className="adm-form-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
              <button
                type="submit"
                className="adm-btn adm-btn-action-primary"
                disabled={submittingPassword}
              >
                {submittingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* 3. STORE SYSTEM & ENVIRONMENT STATUS */}
        <div className="adm-settings-section">
          <div className="adm-settings-header">
            <h3 className="adm-settings-title">Store System Status</h3>
            <p className="adm-settings-desc">
              Operational details for the active ShopEase development environment.
            </p>
          </div>

          <div className="adm-two-col-grid" style={{ fontSize: "13px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid var(--adm-border-subtle)",
              }}
            >
              <div style={{ color: "var(--adm-text-dim)", fontSize: "11px" }}>
                Storefront URL
              </div>
              <div style={{ fontWeight: 600, marginTop: "4px" }}>
                http://localhost:5173
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid var(--adm-border-subtle)",
              }}
            >
              <div style={{ color: "var(--adm-text-dim)", fontSize: "11px" }}>
                Backend API URL
              </div>
              <div style={{ fontWeight: 600, marginTop: "4px" }}>
                http://localhost:5000
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid var(--adm-border-subtle)",
              }}
            >
              <div style={{ color: "var(--adm-text-dim)", fontSize: "11px" }}>
                Catalog Database
              </div>
              <div style={{ fontWeight: 600, color: "#34d399", marginTop: "4px" }}>
                MongoDB Atlas (Connected)
              </div>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid var(--adm-border-subtle)",
              }}
            >
              <div style={{ color: "var(--adm-text-dim)", fontSize: "11px" }}>
                Payment Gateway
              </div>
              <div style={{ fontWeight: 600, marginTop: "4px" }}>
                Razorpay Test API
              </div>
            </div>
          </div>
        </div>

        {/* 4. COMPACT ADMINISTRATOR SESSION */}
        <div className="adm-settings-section" style={{ padding: "18px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              >
                {(adminUser?.name || "M").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14.5px", color: "var(--adm-text-primary)", whiteSpace: "nowrap" }}>
                  {adminUser?.name || "Moien"}
                  <span className="adm-status-pill success" style={{ marginLeft: "8px", fontSize: "10.5px", whiteSpace: "nowrap" }}>
                    Active
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--adm-text-secondary)", marginTop: "2px", whiteSpace: "nowrap" }}>
                  {adminUser?.email || "moienjagrala45@gmail.com"} • <span style={{ color: "var(--adm-accent-cyan)" }}>Administrator</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="adm-btn adm-btn-secondary"
              onClick={handleLogout}
              style={{ whiteSpace: "nowrap" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;

