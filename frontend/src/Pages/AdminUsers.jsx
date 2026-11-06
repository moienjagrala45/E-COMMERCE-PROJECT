import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import AdminLayout from "../components/AdminLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Customer Details Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(getApiUrl("/api/users/admin/all"), {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch registered customers");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch customers error:", err);
      setErrorMessage(err.message || "Failed to load customers from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const nameMatch = (u.name || "").toLowerCase().includes(term);
      const emailMatch = (u.email || "").toLowerCase().includes(term);
      const phoneMatch = (u.address?.phone || "").toLowerCase().includes(term);
      const cityMatch = (u.address?.city || "").toLowerCase().includes(term);
      return nameMatch || emailMatch || phoneMatch || cityMatch;
    });
  }, [users, searchTerm]);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(isoString).slice(0, 10);
    }
  };

  return (
    <AdminLayout active="customers" title="Users">
      {/* PAGE HEADER */}
      <div className="adm-page-header">
        <div className="adm-page-header-text">
          <h1 className="adm-page-title">Users</h1>
          <p className="adm-page-subtitle">
            Registered accounts and access management ({filteredUsers.length} users)
          </p>
        </div>
        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh Users
          </button>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="adm-alert adm-alert-error" style={{ marginBottom: "16px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="adm-filter-bar">
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
            placeholder="Search customers by name, email, phone or city..."
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
      </div>

      {/* USERS TABLE - 7 CLEAN ONE-LINE COLUMNS */}
      <div className="adm-dashboard-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>User</th>
                <th style={{ whiteSpace: "nowrap" }}>Email</th>
                <th style={{ whiteSpace: "nowrap" }}>Phone</th>
                <th style={{ whiteSpace: "nowrap" }}>Registration Date</th>
                <th style={{ whiteSpace: "nowrap" }}>Role</th>
                <th style={{ whiteSpace: "nowrap" }}>Status</th>
                <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Actions</th>
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
                    Loading users from database...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const initials = (u.name || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const isAdmin = u.role === "admin";
                  const phoneText = u.address?.phone || u.phone || "—";

                  return (
                    <tr key={u._id}>
                      {/* USER */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: isAdmin
                                ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                                : "rgba(255, 255, 255, 0.08)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--adm-text-primary)" }}>
                              {u.name || "User"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td style={{ whiteSpace: "nowrap", color: "var(--adm-text-secondary)" }}>
                        {u.email}
                      </td>

                      {/* PHONE */}
                      <td style={{ whiteSpace: "nowrap", color: "var(--adm-text-secondary)" }}>
                        {phoneText}
                      </td>

                      {/* REGISTRATION DATE */}
                      <td style={{ whiteSpace: "nowrap", color: "var(--adm-text-secondary)", fontSize: "12px" }}>
                        {formatDate(u.createdAt)}
                      </td>

                      {/* ROLE */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        {isAdmin ? (
                          <span className="adm-status-pill info" style={{ whiteSpace: "nowrap" }}>
                            Admin
                          </span>
                        ) : (
                          <span className="adm-status-pill neutral" style={{ whiteSpace: "nowrap" }}>
                            Customer
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td style={{ whiteSpace: "nowrap" }}>
                        <span className="adm-status-pill success" style={{ whiteSpace: "nowrap" }}>
                          Active
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link
                          to={`/admin/customers/${u._id}`}
                          className="adm-btn adm-btn-secondary adm-btn-sm"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          View Profile
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
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div
          className="adm-modal-backdrop"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="adm-modal-dialog"
            style={{ maxWidth: "540px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Customer Profile</h3>
              <button
                type="button"
                className="adm-modal-close-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div className="adm-modal-body">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--adm-border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  {(selectedCustomer.name || "Customer")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 2px 0",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedCustomer.name}
                  </h3>
                  <div style={{ color: "var(--adm-text-secondary)", fontSize: "13px" }}>
                    {selectedCustomer.email}
                  </div>
                </div>
              </div>

              {/* ACCOUNT METRICS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--adm-border-subtle)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--adm-text-dim)" }}>
                    Registered On
                  </div>
                  <div style={{ fontWeight: 600, marginTop: "4px" }}>
                    {formatDate(selectedCustomer.createdAt)}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--adm-border-subtle)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--adm-text-dim)" }}>
                    Total Orders
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--adm-accent-cyan)",
                      marginTop: "4px",
                    }}
                  >
                    {selectedCustomer.orderCount || 0} Orders
                  </div>
                </div>
              </div>

              {/* SAVED SHIPPING ADDRESS */}
              <div
                style={{
                  background: "var(--adm-bg-card)",
                  border: "1px solid var(--adm-border-card)",
                  borderRadius: "6px",
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--adm-text-dim)",
                    margin: "0 0 10px 0",
                  }}
                >
                  Saved Shipping Address
                </h4>

                {selectedCustomer.address?.address ? (
                  <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                    <div>
                      <strong>Full Name:</strong>{" "}
                      {selectedCustomer.address.fullName || selectedCustomer.name}
                    </div>
                    <div>
                      <strong>Phone:</strong>{" "}
                      {selectedCustomer.address.phone || "—"}
                    </div>
                    <div>
                      <strong>Address:</strong>{" "}
                      {selectedCustomer.address.address}
                    </div>
                    <div>
                      <strong>City / State:</strong>{" "}
                      {selectedCustomer.address.city},{" "}
                      {selectedCustomer.address.state} –{" "}
                      {selectedCustomer.address.pincode}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", color: "var(--adm-text-dim)" }}>
                    Customer has not added a permanent shipping address yet.
                  </div>
                )}
              </div>
            </div>

            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setSelectedCustomer(null)}
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

export default AdminUsers;
