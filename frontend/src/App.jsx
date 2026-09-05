import { useContext, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
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

  const goToProducts =
    () => {

      document
        .getElementById(
          "products"
        )
        ?.scrollIntoView({

          behavior:
            "smooth",

        });

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
            href="#products"

            onClick={() =>
              navigate("/home")
            }
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


          {/* LOGOUT BUTTON */}

          <button
            className="logout-btn"

            onClick={
              handleLogout
            }
          >

            Logout

          </button>


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


      {/* ================= PRODUCTS SECTION ================= */}

      <section
        className="products-section"

        id="products"
      >


        <div className="products-heading">


          <p>

            OUR PRODUCTS

          </p>


          <h2>

            Explore Our Products

          </h2>


        </div>


        {/* ================= LOADING ================= */}

        {loading ? (

          <p className="loading-text">

            Loading products...

          </p>

        ) : products.length === 0 ? (

          <p className="loading-text">

            No products found.

          </p>

        ) : (

          <div className="products-grid">

            {products.map(
              (product) => (

                <ProductCard
                  key={
                    product._id
                  }

                  product={
                    product
                  }
                />

              )
            )}

          </div>

        )}


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
          <Login />
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
          <AdminDashboard />
        }
      />


      {/* ================= ADMIN PRODUCTS ================= */}

      <Route
        path="/admin/products"

        element={
          <AdminProduct />
        }
      />


      <Route
        path="/admin/products/add"

        element={
          <AddProduct />
        }
      />


      <Route
        path="/admin/products/edit/:id"

        element={
          <EditProduct />
        }
      />


      {/* ================= ADMIN ORDERS ================= */}

      <Route
        path="/admin/orders"

        element={
          <AdminOrders />
        }
      />


      {/* ================= ADMIN USERS ================= */}

      <Route
        path="/admin/users"

        element={
          <AdminUsers />
        }
      />


    </Routes>

  );
}


export default App;