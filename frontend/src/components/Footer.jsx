import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

function Footer({ compact = false, onSelectCategory }) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (typeof onSelectCategory === "function") {
      onSelectCategory(categoryName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/products", { state: { category: categoryName } });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSupportClick = (topicCode) => {
    navigate(`/contact?topic=${topicCode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Useful bottom navigation section for Products and Product Details pages (Logo removed)
  if (compact) {
    return (
      <footer className="shopease-footer-catalog">
        <div className="catalog-footer-inner">
          <div className="catalog-footer-grid">
            {/* GROUP 1: SHOP BY CATEGORY */}
            <div className="catalog-footer-col">
              <h4 className="catalog-footer-heading">Shop by Category</h4>
              <ul className="catalog-footer-links">
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleCategoryClick("Laptops")}
                  >
                    Laptops
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleCategoryClick("Phones")}
                  >
                    Phones
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleCategoryClick("Accessories")}
                  >
                    Accessories
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleCategoryClick("Fashion & Apparel")}
                  >
                    Fashion & Apparel
                  </button>
                </li>
              </ul>
            </div>

            {/* GROUP 2: QUICK LINKS */}
            <div className="catalog-footer-col">
              <h4 className="catalog-footer-heading">Quick Links</h4>
              <ul className="catalog-footer-links">
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleNavClick("/")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleCategoryClick("All")}
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleNavClick("/cart")}
                  >
                    My Cart
                  </button>
                </li>
              </ul>
            </div>

            {/* GROUP 3: HELP & SUPPORT */}
            <div className="catalog-footer-col">
              <h4 className="catalog-footer-heading">Help & Support</h4>
              <ul className="catalog-footer-links">
                <li>
                  <button
                    type="button"
                    className="catalog-footer-link"
                    onClick={() => handleNavClick("/contact")}
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & BACK TO TOP BAR */}
          <div className="catalog-footer-bottom">
            <p className="catalog-footer-copy">
              Designed for clear, everyday shopping. © 2026 ShopEase.
            </p>
            <button
              type="button"
              className="catalog-footer-top-btn"
              onClick={scrollToTop}
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <span>Back to top</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    );
  }

  // Full structured footer for Home, About Us, and Contact pages
  return (
    <footer className="shopease-footer">
      <div className="shopease-footer-container">
        {/* COLUMN 1: SHOPEASE BRAND */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo-wrap">
            <Logo clickable={true} />
          </div>
          <p className="footer-brand-description">
            A simple shopping experience for tech, fashion and everyday essentials.
          </p>
          <p className="footer-brand-tagline">
            Made for simple, everyday shopping.
          </p>
          <p className="footer-brand-subtext">
            Browse. Choose. Shop with ease.
          </p>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleNavClick("/")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleNavClick("/products")}
              >
                Products
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleNavClick("/about")}
              >
                About Us
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleNavClick("/contact")}
              >
                Contact Support
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: PRODUCT CATEGORIES (APPEAR ONCE) */}
        <div className="footer-col">
          <h4 className="footer-col-title">Product Categories</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleCategoryClick("Laptops")}
              >
                Laptops
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleCategoryClick("Phones")}
              >
                Phones
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleCategoryClick("Accessories")}
              >
                Accessories
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleCategoryClick("Fashion & Apparel")}
              >
                Fashion & Apparel
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: CUSTOMER SUPPORT (PRE-SELECTS TOPIC IN CONTACT FORM) */}
        <div className="footer-col">
          <h4 className="footer-col-title">Customer Support</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleSupportClick("general")}
              >
                General Support
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleSupportClick("product")}
              >
                Product Support
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleSupportClick("order")}
              >
                Order Support
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => handleSupportClick("payment")}
              >
                Payment Support
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © 2026 ShopEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
