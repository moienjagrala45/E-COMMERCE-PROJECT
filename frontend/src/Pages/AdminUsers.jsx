import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= FETCH ALL USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const adminToken = localStorage.getItem(
        "adminToken"
      );

      const response = await fetch(
        "https://e-commerce-project-backend-pvdz.onrender.com/api/users/admin/all",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data);

    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );

      setMessage(
        error.message ||
        "Failed to load users."
      );

    } finally {
      setLoading(false);
    }
  };


  /* ================= LOAD USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);


  return (

    <div className="admin-dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <h2>
          ShopEase Admin
        </h2>

        <button
          className="admin-logout-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Dashboard
        </button>

      </nav>


      {/* ================= CONTENT ================= */}

      <div className="admin-content">

        <div className="admin-products-header">

          <div>

            <h1>
              Manage Users
            </h1>

            <p className="admin-welcome">
              View all registered customers.
            </p>

          </div>

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (

          <p className="admin-message">
            {message}
          </p>

        )}


        {/* ================= LOADING ================= */}

        {loading ? (

          <p className="loading-text">
            Loading users...
          </p>

        ) : users.length === 0 ? (

          <div className="admin-card">

            <h3>
              No Users Found
            </h3>

            <p>
              Registered users will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-users-list">

            {users.map((user) => (

              <div
                className="admin-user-card"
                key={user._id}
              >

                <div className="admin-user-info">

                  <div className="admin-user-avatar">

                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>


                  <div>

                    <h3>
                      {user.name}
                    </h3>

                    <p>
                      {user.email}
                    </p>

                  </div>

                </div>


                <div className="admin-user-role">

                  <span
                    className={`user-role ${user.role}`}
                  >

                    {user.role}

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* ================= BACK BUTTON ================= */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >

          ← Back to Dashboard

        </button>

      </div>

    </div>
  );
}

export default AdminUsers;