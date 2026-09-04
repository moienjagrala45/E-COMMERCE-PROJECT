import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* NAVBAR */}
      <nav className="about-navbar">

        <div
          className="about-logo"
          onClick={() => navigate("/home")}
        >
          ShopEase
        </div>

        <div className="about-nav-links">

          <button onClick={() => navigate("/home")}>
            Home
          </button>

          <button onClick={() => navigate("/home")}>
            Products
          </button>

          <button className="active-link">
            About
          </button>

          <button onClick={() => navigate("/contact")}>
            Contact
          </button>

        </div>

      </nav>


      {/* HERO SECTION */}
      <section className="about-hero">

        <p className="about-small-title">
          ABOUT SHOPEASE
        </p>

        <h1>
          Your Simple and Reliable
          <br />
          Shopping Destination
        </h1>

        <p className="about-hero-text">
          ShopEase is an online shopping platform designed to make
          shopping simple, convenient, and enjoyable. Explore a variety
          of products and enjoy a smooth shopping experience in one place.
        </p>

        <button
          className="about-explore-btn"
          onClick={() => navigate("/home")}
        >
          Explore Products
        </button>

      </section>


      {/* WHO WE ARE */}
      <section className="about-content">

        <div className="about-heading">

          <p>WHO WE ARE</p>

          <h2>Shopping Made Simple</h2>

          <span>
            We focus on creating an easy and convenient online
            shopping experience for everyone.
          </span>

        </div>


        {/* CARDS */}
        <div className="about-cards">

          <div className="about-card">

            <div className="about-icon">🛍️</div>

            <h3>Quality Products</h3>

            <p>
              We aim to provide products that meet customer
              expectations and deliver great value.
            </p>

          </div>


          <div className="about-card">

            <div className="about-icon">⚡</div>

            <h3>Easy Shopping</h3>

            <p>
              Browse products, add your favorites to the cart,
              and place your order with ease.
            </p>

          </div>


          <div className="about-card">

            <div className="about-icon">❤️</div>

            <h3>Customer Satisfaction</h3>

            <p>
              Our goal is to provide a simple, smooth, and
              reliable shopping experience for every customer.
            </p>

          </div>

        </div>


        {/* MISSION */}
        <section className="mission-section">

          <p className="mission-small-title">
            OUR MISSION
          </p>

          <h2>
            Making Online Shopping Better
          </h2>

          <p>
            Our mission is to make online shopping easier, faster,
            and more convenient by providing a simple platform where
            customers can discover products and shop with confidence.
          </p>

        </section>

      </section>

    </div>
  );
}

export default About;