import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= FETCH ALL ORDERS ================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      const adminToken = localStorage.getItem(
        "adminToken"
      );

      const response = await fetch(
        "https://e-commerce-project-backend-pvdz.onrender.com/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data);

    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );

      setMessage(
        error.message ||
          "Failed to load orders."
      );

    } finally {
      setLoading(false);
    }
  };


  /* ================= LOAD ORDERS ================= */

  useEffect(() => {
    fetchOrders();
  }, []);


  /* ================= UPDATE ORDER STATUS ================= */

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      const adminToken = localStorage.getItem(
        "adminToken"
      );

      const response = await fetch(
        "https://e-commerce-project-backend-pvdz.onrender.com/api/orders/${orderId}/status",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${adminToken}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      /* Update UI without refresh */

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      alert(
        "Order status updated successfully!"
      );

    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update order status"
      );
    }
  };


  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


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
              Manage Orders
            </h1>

            <p className="admin-welcome">
              View and manage customer orders.
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
            Loading orders...
          </p>

        ) : orders.length === 0 ? (

          <div className="admin-card">

            <h3>
              No Orders Yet
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-orders-list">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="admin-order-header">

                  <div>

                    <h3>
                      Order #
                      {order._id.slice(-6)}
                    </h3>

                    <p>
                      {formatDate(
                        order.createdAt
                      )}
                    </p>

                  </div>


                  <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>

                </div>


                {/* CUSTOMER DETAILS */}

                <div className="admin-order-customer">

                  <p>
                    <strong>
                      Customer:
                    </strong>{" "}

                    {order.user?.name ||
                      "Unknown User"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}

                    {order.user?.email ||
                      "No email"}
                  </p>

                </div>


                {/* ORDER PRODUCTS */}

                <div className="admin-order-items">

                  <h4>
                    Ordered Products
                  </h4>

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="admin-order-item"
                        key={index}
                      >

                        <div>

                          <p>
                            {item.product?.name ||
                              "Product"}
                          </p>

                          <span>
                            Quantity:{" "}
                            {item.quantity}
                          </span>

                        </div>

                        <strong>
                          ₹
                          {(
                            (item.product?.price ||
                              0) *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    )
                  )}

                </div>


                {/* ORDER FOOTER */}

                <div className="admin-order-footer">

                  <h3>
                    Total: ₹
                    {order.totalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </h3>


                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                  </select>

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

export default AdminOrders;