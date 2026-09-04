import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] =
    useState("");


  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    setSuccessMessage(
      "Thank you! Your message has been sent successfully."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  };


  return (

    <div className="contact-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          ShopEase
        </div>


        <div className="nav-links">

          <button
            onClick={() => navigate("/home")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/about")}
          >
            About
          </button>

          <button className="active-nav">
            Contact
          </button>

        </div>


        <div className="nav-actions">

          <button
            onClick={() => navigate("/cart")}
          >
            🛒 Cart
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= CONTACT HERO ================= */}

      <section className="contact-hero">

        <p className="small-title">
          GET IN TOUCH
        </p>

        <h1>
          We'd Love to Hear From You
        </h1>

        <p>
          Have a question, feedback, or need help?
          Send us a message and we'll get back to you.
        </p>

      </section>


      {/* ================= CONTACT CONTENT ================= */}

      <section className="contact-section">

        {/* CONTACT INFORMATION */}

        <div className="contact-info">

          <h2>
            Contact Information
          </h2>

          <p>
            Our team is always ready to help you
            with your questions and shopping experience.
          </p>


          <div className="contact-detail">

            <span>📧</span>

            <div>

              <h3>Email</h3>

              <p>
                support@shopease.com
              </p>

            </div>

          </div>


          <div className="contact-detail">

            <span>📞</span>

            <div>

              <h3>Phone</h3>

              <p>
                +91 98765 43210
              </p>

            </div>

          </div>


          <div className="contact-detail">

            <span>📍</span>

            <div>

              <h3>Location</h3>

              <p>
                India
              </p>

            </div>

          </div>

        </div>


        {/* CONTACT FORM */}

        <div className="contact-form-container">

          <h2>
            Send Us a Message
          </h2>


          {successMessage && (

            <div className="contact-success">

              ✓ {successMessage}

            </div>

          )}


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />


            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />


            <textarea
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            />


            <button type="submit">

              Send Message →

            </button>

          </form>

        </div>

      </section>


      {/* ================= BACK BUTTON ================= */}

      <div className="contact-back">

        <button
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>

      </div>

    </div>

  );
}

export default Contact;