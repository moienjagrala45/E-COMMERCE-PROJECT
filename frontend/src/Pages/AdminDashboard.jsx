import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* ================= CHECK ADMIN ================= */

  useEffect(() => {
    const adminToken =
      localStorage.getItem("adminToken");

    const adminUser =
      localStorage.getItem("adminUser");

    if (!adminToken || !adminUser) {
      navigate("/admin");
      return;
    }

    try {
      const user =
        JSON.parse(adminUser);

      if (user.role !== "admin") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin");
      }

    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      navigate("/admin");
    }

  }, [navigate]);


  /* ================= FETCH DASHBOARD STATS ================= */

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const adminToken =
        localStorage.getItem("adminToken");

      if (!adminToken) {
        navigate("/admin");
        return;
      }

      const response = await fetch(
        "https://e-commerce-project-backend-pvdz.onrender.com/api/admin/stats",
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch dashboard statistics"
        );
      }

      setStats({
        totalProducts:
          data.totalProducts || 0,

        totalOrders:
          data.totalOrders || 0,

        totalUsers:
          data.totalUsers || 0,

        totalRevenue:
          data.totalRevenue || 0,
      });

    } catch (error) {

      console.error(
        "Dashboard stats error:",
        error
      );

      setError(
        error.message ||
        "Failed to load dashboard statistics"
      );

    } finally {
      setLoading(false);
    }
  };


  /* ================= LOAD STATS ================= */

  useEffect(() => {
    fetchDashboardStats();
  }, []);


  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    navigate("/admin");
  };


  return (
    <div className="admin-dashboard">


      {/* ================= ADMIN NAVBAR ================= */}

      <nav className="admin-navbar">

        <h2>
          ShopEase Admin
        </h2>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </nav>


      {/* ================= DASHBOARD CONTENT ================= */}

      <div className="admin-content">

        <h1>
          Admin Dashboard
        </h1>

        <p className="admin-welcome">
          Welcome to the ShopEase Admin Panel
        </p>


        {/* ================= ERROR MESSAGE ================= */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* ================= STATISTICS ================= */}

        <div className="admin-stats">


          {/* TOTAL PRODUCTS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div className="stat-info">

              <p>
                Total Products
              </p>

              <h2>
                {loading
                  ? "..."
                  : stats.totalProducts}
              </h2>

            </div>

          </div>


          {/* TOTAL ORDERS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              🛒
            </div>

            <div className="stat-info">

              <p>
                Total Orders
              </p>

              <h2>
                {loading
                  ? "..."
                  : stats.totalOrders}
              </h2>

            </div>

          </div>


          {/* TOTAL USERS */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div className="stat-info">

              <p>
                Total Users
              </p>

              <h2>
                {loading
                  ? "..."
                  : stats.totalUsers}
              </h2>

            </div>

          </div>


          {/* TOTAL REVENUE */}

          <div className="admin-stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div className="stat-info">

              <p>
                Total Revenue
              </p>

              <h2>
                {loading
                  ? "..."
                  : `₹${Number(
                      stats.totalRevenue
                    ).toLocaleString("en-IN")}`}
              </h2>

            </div>

          </div>

        </div>


        {/* ================= ADMIN ACTION CARDS ================= */}

        <div className="admin-cards">


          {/* PRODUCTS */}

          <div className="admin-card">

            <div className="admin-card-icon">
              📦
            </div>

            <h3>
              Products
            </h3>

            <p>
              Add, edit and delete products.
            </p>

            <button
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Manage Products
            </button>

          </div>


          {/* ORDERS */}

          <div className="admin-card">

            <div className="admin-card-icon">
              🛒
            </div>

            <h3>
              Orders
            </h3>

            <p>
              View and manage customer orders.
            </p>

            <button
              onClick={() =>
                navigate("/admin/orders")
              }
            >
              Manage Orders
            </button>

          </div>


          {/* USERS */}

          <div className="admin-card">

            <div className="admin-card-icon">
              👥
            </div>

            <h3>
              Users
            </h3>

            <p>
              View registered customers.
            </p>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
            >
              Manage Users
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;