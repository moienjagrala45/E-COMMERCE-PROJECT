import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth({ initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab);

  const navigate = useNavigate();

  // ================= LOGIN STATE =================

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ================= SIGNUP STATE =================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signupShowPassword, setSignupShowPassword] =
    useState(false);

  const [signupShowConfirm, setSignupShowConfirm] =
    useState(false);

  const [signupMessage, setSignupMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // ================= EXISTING SESSION =================

  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (token && user) {
        setExistingUser(user);
      }
    } catch {
      setExistingUser(null);
    }
  }, []);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginMessage("");
    setLoginLoading(true);

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-vpdz.onrender.com/api/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginMessage(
          data.message ||
            "Invalid credentials. Please try again."
        );

        setLoginLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      setLoginMessage(
        "Network error. Please check your internet connection."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ================= SIGNUP =================

  const handleSignup = async (e) => {
    e.preventDefault();

    setSignupMessage("");
    setSignupSuccess("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setSignupMessage(
        "All fields are required and cannot be empty spaces."
      );

      return;
    }

    if (signupPassword.trim().length < 6) {
      setSignupMessage(
        "Password must be at least 6 characters long."
      );

      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupMessage(
        "Passwords do not match."
      );

      return;
    }

    setSignupLoading(true);

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-vpdz.onrender.com/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: `${firstName.trim()} ${lastName.trim()}`,
            email: signupEmail.trim(),
            password: signupPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSignupMessage(
          data.message ||
            "Account creation failed."
        );

        setSignupLoading(false);
        return;
      }

      setSignupSuccess(
        "Account created successfully! Switching to sign in..."
      );

      setLoginEmail(signupEmail.trim());

      setFirstName("");
      setLastName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setTab("login");
        setSignupSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);

      setSignupMessage(
        "Network error. Please try again."
      );
    } finally {
      setSignupLoading(false);
    }
  };

  // ================= LOGOUT EXISTING USER =================

  const handleLogoutExisting = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setExistingUser(null);
  };

  // ================= SWITCH TAB =================

  const switchToLogin = () => {
    setTab("login");

    setLoginMessage("");
    setSignupMessage("");
    setSignupSuccess("");
  };

  const switchToSignup = () => {
    setTab("signup");

    setLoginMessage("");
    setSignupMessage("");
    setSignupSuccess("");
  };

  return (
    <section className="auth-page-container">

      {/* ================= LEFT BRAND PANEL ================= */}

      <div className="auth-brand-panel">

        <div className="brand-decoration brand-decoration-one"></div>
        <div className="brand-decoration brand-decoration-two"></div>

        <div className="brand-content">

          <div
            className="auth-brand-logo"
            onClick={() => navigate("/home")}
          >
            <span className="brand-icon">🛍️</span>
            <span>ShopEase</span>
          </div>

          <div className="brand-line"></div>

          <h1>
            Everything You Need,
            <br />
            <span>All In One Place.</span>
          </h1>

          <p>
            Discover premium electronics, fashion,
            lifestyle products and everyday essentials
            with a secure shopping experience.
          </p>

          <div className="brand-features">

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Premium Products</strong>
                <small>Carefully selected for you</small>
              </div>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Secure Payments</strong>
                <small>Protected by Razorpay</small>
              </div>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>Quick and reliable shipping</small>
              </div>
            </div>

          </div>

        </div>

        <div className="brand-footer">
          © 2026 ShopEase · Premium Shopping Experience
        </div>

      </div>

      {/* ================= RIGHT AUTH PANEL ================= */}

      <div className="auth-form-panel">

        <div className="auth-form-container">

          {/* Mobile Logo */}

          <div
            className="mobile-auth-logo"
            onClick={() => navigate("/home")}
          >
            🛍️ <span>ShopEase</span>
          </div>

          {/* Existing User */}

          {existingUser && (
            <div className="existing-session-banner">

              <div className="session-info">

                <div className="session-avatar">
                  {existingUser.name
                    ? existingUser.name[0].toUpperCase()
                    : "U"}
                </div>

                <div>
                  <small>Currently signed in as</small>

                  <strong>
                    {existingUser.name || "Customer"}
                  </strong>
                </div>

              </div>

              <div className="session-actions">

                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="session-store-btn"
                >
                  Go to Store
                </button>

                <button
                  type="button"
                  onClick={handleLogoutExisting}
                  className="session-switch-btn"
                >
                  Switch
                </button>

              </div>

            </div>
          )}

          {/* Heading */}

          <div className="auth-heading">

            <span className="auth-small-heading">
              SHOP WITH CONFIDENCE
            </span>

            <h2>
              {tab === "login"
                ? "Welcome back."
                : "Create your account."}
            </h2>

            <p>
              {tab === "login"
                ? "Sign in to continue your shopping journey."
                : "Join ShopEase and start shopping today."}
            </p>

          </div>

          {/* Tabs */}

          <div className="auth-tabs-toggle">

            <button
              type="button"
              className={
                tab === "login"
                  ? "auth-tab-btn active"
                  : "auth-tab-btn"
              }
              onClick={switchToLogin}
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                tab === "signup"
                  ? "auth-tab-btn active"
                  : "auth-tab-btn"
              }
              onClick={switchToSignup}
            >
              Create Account
            </button>

          </div>

          {/* ================= LOGIN ================= */}

          {tab === "login" && (
            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              {loginMessage && (
                <div className="auth-alert-message error">
                  ⚠️ {loginMessage}
                </div>
              )}

              <div className="auth-input-group">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                />

              </div>

              <div className="auth-input-group">

                <div className="label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <span>
                    Secure Login
                  </span>
                </div>

                <div className="password-wrapper">

                  <input
                    id="login-password"
                    type={
                      loginShowPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) =>
                      setLoginPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setLoginShowPassword(
                        !loginShowPassword
                      )
                    }
                  >
                    {loginShowPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Signing in..."
                  : "Sign In to ShopEase →"}
              </button>

              <div className="auth-footer-prompt">

                Don't have an account?

                <span
                  className="auth-switch-link"
                  onClick={switchToSignup}
                >
                  Create an account
                </span>

              </div>

            </form>
          )}

          {/* ================= SIGNUP ================= */}

          {tab === "signup" && (
            <form
              className="auth-form"
              onSubmit={handleSignup}
            >

              {signupMessage && (
                <div className="auth-alert-message error">
                  ⚠️ {signupMessage}
                </div>
              )}

              {signupSuccess && (
                <div className="auth-alert-message success">
                  ✓ {signupSuccess}
                </div>
              )}

              <div className="auth-grid-2col">

                <div className="auth-input-group">

                  <label htmlFor="signup-firstname">
                    First Name
                  </label>

                  <input
                    id="signup-firstname"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="auth-input-group">

                  <label htmlFor="signup-lastname">
                    Last Name
                  </label>

                  <input
                    id="signup-lastname"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="auth-input-group">

                <label htmlFor="signup-email">
                  Email Address
                </label>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) =>
                    setSignupEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                />

              </div>

              <div className="auth-input-group">

                <label htmlFor="signup-password">
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    id="signup-password"
                    type={
                      signupShowPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Minimum 6 characters"
                    value={signupPassword}
                    onChange={(e) =>
                      setSignupPassword(e.target.value)
                    }
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setSignupShowPassword(
                        !signupShowPassword
                      )
                    }
                  >
                    {signupShowPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              <div className="auth-input-group">

                <label htmlFor="signup-confirm">
                  Confirm Password
                </label>

                <div className="password-wrapper">

                  <input
                    id="signup-confirm"
                    type={
                      signupShowConfirm
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setSignupShowConfirm(
                        !signupShowConfirm
                      )
                    }
                  >
                    {signupShowConfirm
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={signupLoading}
              >
                {signupLoading
                  ? "Creating account..."
                  : "Create My ShopEase Account →"}
              </button>

              <div className="auth-footer-prompt">

                Already have an account?

                <span
                  className="auth-switch-link"
                  onClick={switchToLogin}
                >
                  Sign In
                </span>

              </div>

            </form>
          )}

          {/* Security */}

          <div className="auth-security">

            <span>🔒</span>

            <div>
              <strong>Secure & Protected</strong>
              <small>
                Your account information is securely
                processed.
              </small>
            </div>

          </div>

          <div className="auth-payment-note">
            Payments securely powered by Razorpay
          </div>

        </div>

      </div>

    </section>
  );
}

export default Auth;