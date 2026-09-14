import { useContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import "./App.css";

/* ================= CUSTOMER COMPONENTS ================= */

import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OrderSuccess from "./components/OrderSuccess";

/* ================= CUSTOMER PAGES ================= */

import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ProductsPage from "./Pages/ProductsPage";

/* ================= ADMIN COMPONENTS ================= */

import AdminProduct from "./components/AdminProduct";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";

/* ================= ADMIN PAGES ================= */

import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/Adminlogin";
import AdminOrders from "./Pages/AdminOrders";
import AdminUsers from "./Pages/AdminUsers";

/* ================= CONTEXT ================= */

import {
  CartContext,
} from "./context/CartContext";


/* =========================================================
   CUSTOMER HOME PAGE
========================================================= */

function Home() {

  const {
    cartItems,
    notification,
  } = useContext(CartContext);


  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const navigate =
    useNavigate();


  const location =
    useLocation();


  useEffect(() => {

    if (
      location.state?.scrollTo ===
      "products"
    ) {

      const productsSection =
        document.getElementById(
          "products"
        );


      productsSection?.scrollIntoView({
        behavior:
          "smooth",
      });

    }

  }, [
    location.state,
  ]);


  /* ================= LOGGED IN USER ================= */

  const savedUser =
    JSON.parse(
      localStorage.getItem("user")
    );


  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const response =
            await fetch(
              "https://e-commerce-project-backend-vpdz.onrender.com/api/products"
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              "Failed to fetch products"
            );

          }


          console.log(
            "Products:",
            data
          );


          setProducts(data);


        } catch (error) {

          console.error(
            "Error fetching products:",
            error
          );


        } finally {

          setLoading(false);

        }
      };


    fetchProducts();


  }, []);


  /* ================= CART TOTAL ITEMS ================= */

  const totalItems =
    cartItems.reduce(
      (total, item) => {

        return (
          total +
          item.quantity
        );

      },
      0
    );


  /* ================= SHOP NOW ================= */

  const goToProducts = () => {
    navigate("/products");
  };


  /* ================= LOGOUT ================= */

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );


      navigate(
        "/login"
      );

    };


  return (

    <div>


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">


        <div
          className="logo"

          onClick={() =>
            navigate("/home")
          }

          style={{
            cursor:
              "pointer",
          }}
        >

          ShopEase

        </div>


        {/* ================= NAV LINKS ================= */}

        <div className="nav-links">


          <a
            href="#home"

            onClick={() =>
              navigate("/home")
            }
          >

            Home

          </a>


          <a
            href="/products"
            onClick={(e) => {
              e.preventDefault();
              navigate("/products");
            }}
          >
            Products
          </a>


          <a
            href="#about"

            onClick={(e) => {

              e.preventDefault();

              navigate(
                "/about"
              );

            }}
          >

            About

          </a>


          <a
            href="#contact"

            onClick={(e) => {

              e.preventDefault();

              navigate(
                "/contact"
              );

            }}
          >

            Contact

          </a>


        </div>


        {/* ================= NAV ACTIONS ================= */}

        <div className="nav-actions">


          {/* CART BUTTON */}

          <button
            onClick={() =>
              navigate("/cart")
            }
          >

            🛒 Cart ({totalItems})

          </button>


          {/* LOGIN / LOGOUT BUTTON */}

          {localStorage.getItem("token") ? (
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="logout-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}


        </div>


      </nav>


      {/* ================= HERO SECTION ================= */}

      <section
        className="hero"

        id="home"
      >


        <div className="hero-content">


          <p className="small-title">

            WELCOME TO SHOPEASE

          </p>


          <h1>

            Welcome,{" "}

            {
              savedUser?.name ||
              "User"
            }

            !

            <br />

            Everything You Need,

            <br />

            All In One Place.

          </h1>


          <p className="hero-text">

            Discover amazing products at great prices.
            Shop your favorite items from the comfort
            of your home.

          </p>


          <button
            className="shop-btn"

            onClick={
              goToProducts
            }
          >

            Shop Now →

          </button>


        </div>


      </section>


      {/* ================= FEATURED SHOWCASE ================= */}

      <section className="products-section" id="products">
        <div className="products-heading">
          <p>FEATURED COLLECTION</p>
          <h2>Explore Our Store</h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>
            Click Shop Now to view full product details, specs, and complete catalog.
          </p>
        </div>

        <div style={{ textAlign: "center", margin: "20px 0 40px" }}>
          <button
            className="shop-btn"
            onClick={() => navigate("/products")}
            style={{ fontSize: "16px", padding: "16px 36px" }}
          >
            Open Dedicated Products Page →
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading featured items...</p>
        ) : products.length === 0 ? (
          <p className="loading-text">No products found.</p>
        ) : (
          <div className="products-grid">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            className="shop-btn"
            onClick={() => navigate("/products")}
            style={{ background: "#4f46e5" }}
          >
            View All Products in Shop ({products.length || 9}) →
          </button>
        </div>
      </section>


      {/* ================= ADD TO CART NOTIFICATION ================= */}

      {notification && (

        <div className="cart-notification">

          ✓ {notification} added to Cart!

        </div>

      )}


    </div>

  );
}


/* ================= ADMIN ROUTE GUARD ================= */

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  if (!adminToken || !adminUser) {
    return <Navigate to="/admin" replace />;
  }

  try {
    const user = JSON.parse(adminUser);
    if (user.role !== "admin") {
      return <Navigate to="/admin" replace />;
    }
  } catch {
    return <Navigate to="/admin" replace />;
  }

  return children;
}


/* =========================================================
   APP ROUTES
========================================================= */

function App() {

  return (

    <Routes>


      {/* ================= CUSTOMER ROUTES ================= */}

      <Route
        path="/"
        element={
          <Home />
        }
      />


      <Route
        path="/login"

        element={
          <Login />
        }
      />


      <Route
        path="/signup"

        element={
          <Signup />
        }
      />


      <Route
        path="/home"

        element={
          <Home />
        }
      />

      {/* ================= DEDICATED PRODUCTS / SHOP PAGE ================= */}

      <Route
        path="/products"
        element={<ProductsPage />}
      />

      <Route
        path="/shop"
        element={<Navigate to="/products" replace />}
      />

      {/* ================= CART ================= */}

      <Route
        path="/cart"

        element={
          <Cart />
        }
      />


      {/* ================= CHECKOUT ================= */}

       <Route
        path="/checkout"
        element={
          <Checkout />
        }
      />


      {/* ================= ORDER SUCCESS ================= */}

       <Route
         path="/order-success"
         element={
          <OrderSuccess />
        }
      />


      {/* ================= ABOUT ================= */}

      <Route
        path="/about"

        element={
          <About />
        }
      />


      {/* ================= CONTACT ================= */}

      <Route
        path="/contact"

        element={
          <Contact />
        }
      />


      {/* ================= ADMIN LOGIN ================= */}

      <Route
        path="/admin"

        element={
          <AdminLogin />
        }
      />


      {/* ================= ADMIN DASHBOARD ================= */}

      <Route
        path="/admin/dashboard"

        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN PRODUCTS ================= */}

      <Route
        path="/admin/products"

        element={
          <AdminRoute>
            <AdminProduct />
          </AdminRoute>
        }
      />


      <Route
        path="/admin/products/add"

        element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        }
      />


      <Route
        path="/admin/products/edit/:id"

        element={
          <AdminRoute>
            <EditProduct />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN ORDERS ================= */}

      <Route
        path="/admin/orders"

        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />


      {/* ================= ADMIN USERS ================= */}

      <Route
        path="/admin/users"

        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />


    </Routes>

  );
}


export default App;