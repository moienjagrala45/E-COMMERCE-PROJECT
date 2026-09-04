import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


function AdminProducts() {

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const navigate =
    useNavigate();


  // ================= FETCH PRODUCTS =================

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            "http://192.168.0.101:5000/api/products"
          );

        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to fetch products"
          );

        }


        setProducts(data);

        setMessage("");

      } catch (error) {

        console.error(
          "Error fetching products:",
          error
        );

        setMessage(
          error.message ||
          "Failed to load products. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  // ================= LOAD PRODUCTS =================

  useEffect(
    () => {

      fetchProducts();

    },
    []
  );


  // ================= DELETE PRODUCT =================

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );


      if (!confirmDelete) {

        return;

      }


      try {

        const adminToken =
          localStorage.getItem(
            "adminToken"
          );


        if (!adminToken) {

          alert(
            "Admin login required"
          );

          navigate("/admin");

          return;

        }


        const response =
          await fetch(
            `http://192.168.0.101:5000/api/products/${id}`,
            {
              method: "DELETE",

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
            "Failed to delete product"
          );

        }


        setProducts(
          (prevProducts) =>
            prevProducts.filter(
              (product) =>
                product._id !== id
            )
        );


        alert(
          "Product deleted successfully!"
        );


      } catch (error) {

        console.error(
          "Delete error:",
          error
        );

        alert(
          error.message ||
          "Failed to delete product"
        );

      }

    };


  // ================= RETURN =================

  return (

    <div className="admin-products-page">


      {/* ================= HEADER ================= */}

      <div className="admin-products-header">

        <div>

          <h1>
            Manage Products
          </h1>

          <p>
            Add, edit and delete your store products.
          </p>

        </div>


        <button
          className="add-product-btn"
          onClick={() =>
            navigate(
              "/admin/products/add"
            )
          }
        >
          + Add Product
        </button>

      </div>


      {/* ================= BACK BUTTON ================= */}

      <button
        className="back-btn"
        onClick={() =>
          navigate(
            "/admin/dashboard"
          )
        }
      >
        ← Back to Dashboard
      </button>


      {/* ================= ERROR MESSAGE ================= */}

      {message && (

        <p className="admin-message">
          {message}
        </p>

      )}


      {/* ================= LOADING / PRODUCTS ================= */}

      {loading ? (

        <p className="loading-text">
          Loading products...
        </p>

      ) : products.length === 0 ? (

        <p className="loading-text">
          No products found.
        </p>

      ) : (

        <div className="admin-products-grid">

          {products.map(
            (product) => (

              <div
                className="admin-product-card"
                key={product._id}
              >


                {/* PRODUCT IMAGE */}

                <img
                  src={product.image}
                  alt={product.name}
                  className="admin-product-image"
                />


                {/* PRODUCT INFO */}

                <div className="admin-product-info">


                  <p className="admin-product-category">
                    {product.category}
                  </p>


                  <h3>
                    {product.name}
                  </h3>


                  <p className="admin-product-price">
                    ₹{product.price}
                  </p>


                  {/* ACTION BUTTONS */}

                  <div className="admin-product-actions">


                    <button
                      className="edit-product-btn"
                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product._id}`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>


                    <button
                      className="delete-product-btn"
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>


                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


export default AdminProducts;