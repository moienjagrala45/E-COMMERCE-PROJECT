import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

// Supported topic options and explicit URL mapping (Sections 6, 9 & 10)
const TOPIC_MAP = {
  general: "General Support",
  product: "Product Support",
  order: "Order Support",
  payment: "Payment Support",
};

const TOPICS = [
  "General Support",
  "Product Support",
  "Order Support",
  "Payment Support",
];

function Contact() {
  const [searchParams] = useSearchParams();
  const rawParam = searchParams.get("topic");
  const topicParam = (rawParam || "").toLowerCase().trim();

  // Initialize with mapped topic if arriving via customer support link, otherwise empty ("Select a topic")
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    topic: TOPIC_MAP[topicParam] || "",
    message: "",
  }));

  const [notice, setNotice] = useState(false);

  // Synchronize Topic when arriving through a specific footer link or direct query URL (Section 13 & 14)
  useEffect(() => {
    const matched = TOPIC_MAP[topicParam];
    if (matched) {
      setFormData((prev) => ({ ...prev, topic: matched }));
    } else if (!topicParam) {
      // Normal visit (e.g. from Quick Links -> Contact Support): default to empty ("Select a topic")
      setFormData((prev) => ({ ...prev, topic: "" }));
    }
  }, [topicParam]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.topic && formData.message.trim()) {
      // Per project guidelines (Section 15): do not fake a "Message sent successfully" dispatch
      // when no real backend mailer/API is connected. Show an honest informational status.
      setNotice(true);
    }
  };

  return (
    <div className="shopease-dark-root">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. MAIN SUPPORT PAGE CONTENT */}
      <main className="contact-page-wrapper">
        {/* NEW CONTACT PAGE HERO */}
        <div className="contact-header-wrap">
          <h1 className="contact-page-title">Tell us how we can help.</h1>
          <p className="contact-page-subtitle">
            Have a question about a product, order, payment or using ShopEase? Send us the details below.
          </p>
        </div>

        {/* PREMIUM SPLIT LAYOUT */}
        <div className="contact-split-grid">
          {/* LEFT SIDE: CONTEXT & ABSTRACT VISUAL */}
          <div className="contact-context-pane">
            <h2 className="contact-context-heading">
              We're here to point you in the right direction.
            </h2>
            <p className="contact-context-text">
              Share the details of your question and use the topic field to help organize your request.
            </p>

            {/* ABSTRACT SUPPORT / CONVERSATION GRAPHIC */}
            <div className="contact-visual-card">
              <svg
                viewBox="0 0 360 250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="contact-abstract-graphic"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="contact-grad-bubble-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="contact-grad-bubble-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.75" />
                  </linearGradient>
                  <radialGradient id="contact-ambient-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#090c15" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Soft ambient background glow */}
                <ellipse cx="180" cy="125" rx="150" ry="95" fill="url(#contact-ambient-glow)" />

                {/* Abstract Dialogue Bubble 1 (Inquiry / Left) */}
                <g transform="translate(40, 45)">
                  <rect
                    x="0"
                    y="0"
                    width="185"
                    height="92"
                    rx="16"
                    fill="#101526"
                    stroke="url(#contact-grad-bubble-1)"
                    strokeWidth="1.5"
                  />
                  {/* Subtle placeholder content lines */}
                  <rect x="22" y="24" width="75" height="7" rx="3.5" fill="#8b5cf6" fillOpacity="0.65" />
                  <rect x="22" y="42" width="140" height="5" rx="2.5" fill="#64748b" fillOpacity="0.5" />
                  <rect x="22" y="56" width="100" height="5" rx="2.5" fill="#64748b" fillOpacity="0.35" />
                  {/* Bubble notch */}
                  <path d="M26 92 L20 105 L40 92 Z" fill="#101526" stroke="url(#contact-grad-bubble-1)" strokeWidth="1.5" />
                  <line x1="23" y1="92" x2="40" y2="92" stroke="#101526" strokeWidth="2.5" />
                </g>

                {/* Abstract Dialogue Bubble 2 (Direction / Right) */}
                <g transform="translate(145, 110)">
                  <rect
                    x="0"
                    y="0"
                    width="175"
                    height="88"
                    rx="16"
                    fill="#151b30"
                    stroke="url(#contact-grad-bubble-2)"
                    strokeWidth="1.5"
                  />
                  {/* Subtle content lines */}
                  <rect x="22" y="24" width="85" height="7" rx="3.5" fill="#ec4899" fillOpacity="0.75" />
                  <rect x="22" y="42" width="130" height="5" rx="2.5" fill="#94a3b8" fillOpacity="0.6" />
                  <rect x="22" y="56" width="85" height="5" rx="2.5" fill="#94a3b8" fillOpacity="0.35" />
                  {/* Bubble notch */}
                  <path d="M148 88 L154 100 L134 88 Z" fill="#151b30" stroke="url(#contact-grad-bubble-2)" strokeWidth="1.5" />
                  <line x1="134" y1="88" x2="152" y2="88" stroke="#151b30" strokeWidth="2.5" />
                </g>

                {/* Modern connection accent pulses */}
                <circle cx="160" cy="108" r="4" fill="#c084fc" />
                <circle cx="178" cy="98" r="2.5" fill="#ec4899" />
                <circle cx="196" cy="92" r="3.5" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          {/* RIGHT SIDE: PREMIUM FORM PANEL */}
          <div className="contact-form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="contact-field-group">
                <label htmlFor="contact-name" className="contact-label">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="contact-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="contact-field-group">
                <label htmlFor="contact-email" className="contact-label">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="contact-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Topic Select */}
              <div className="contact-field-group">
                <label htmlFor="contact-topic" className="contact-label">
                  Topic
                </label>
                <div className="contact-select-wrap">
                  <select
                    id="contact-topic"
                    name="topic"
                    className="contact-select"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled={formData.topic !== ""}>
                      Select a topic
                    </option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="contact-select-arrow"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div className="contact-field-group">
                <label htmlFor="contact-message" className="contact-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className="contact-textarea"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="contact-submit-btn">
                <span>Send Message</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              {/* TRUTHFUL SUBMISSION STATUS (Section 15) */}
              {notice && (
                <div className="contact-notice-box" role="status">
                  <div className="contact-notice-header">
                    <span className="contact-notice-title">Demonstration Environment Notice</span>
                    <button
                      type="button"
                      className="contact-notice-dismiss"
                      onClick={() => setNotice(false)}
                      title="Dismiss notice"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="contact-notice-text">
                    Your details are recorded in this form session. Because this project is running as an educational local demo without an active email gateway or backend API endpoint, live message dispatch requires connecting a mail delivery service.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
}

export default Contact;
