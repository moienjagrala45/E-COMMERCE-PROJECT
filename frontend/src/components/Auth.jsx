import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Auth({ initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab); // "login" or "signup"
  const navigate = useNavigate();
  const location = useLocation();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupShowConfirm, setSignupShowConfirm] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Existing session state
  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        setExistingUser(user);
      }
    } catch {
      setExistingUser(null);
    }
  }, []);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  /* ================= LOGIN HANDLER ================= */
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
        setLoginMessage(data.message || "Invalid credentials. Please try again.");
        setLoginLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("Network error. Please check your internet connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ================= SIGNUP HANDLER ================= */
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
      setSignupMessage("All fields are required and cannot be empty spaces.");
      return;
    }

    if (signupPassword.trim().length < 6) {
      setSignupMessage("Password must be at least 6 characters long.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupMessage("Passwords do not match.");
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
        setSignupMessage(data.message || "Account creation failed.");
        setSignupLoading(false);
        return;
      }

      setSignupSuccess("Account created successfully! Switching to sign in...");
      // Pre-fill login email
      setLoginEmail(signupEmail.trim());

      setTimeout(() => {
        setTab("login");
        setSignupSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      setSignupMessage("Network error. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogoutExisting = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setExistingUser(null);
  };

  return (
    <section className="auth-page-container">
      <div className="auth-card-wrapper">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-logo" onClick={() => navigate("/home")}>
            🛍️ ShopEase
          </div>
          <p className="auth-brand-tagline">
            Your Premium Destination for Quality Essentials
          </p>
        </div>

        {/* Existing Session Alert */}
        {existingUser && (
          <div className="existing-session-banner">
            <div className="session-info">
              <span className="session-avatar">
                {existingUser.name ? existingUser.name[0].toUpperCase() : "U"}
              </span>
              <div>
                <p className="session-greeting">Logged in as</p>
                <p className="session-name">{existingUser.name || "Customer"}</p>
              </div>
            </div>
            <div className="session-actions">
              <button
                type="button"
                className="btn-continue-store"
                onClick={() => navigate("/home")}
              >
                Go to Store →
              </button>
              <button
                type="button"
                className="btn-switch-account"
                onClick={handleLogoutExisting}
              >
                Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="auth-tabs-toggle">
          <button
            type="button"
            className={`auth-tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setLoginMessage("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === "signup" ? "active" : ""}`}
            onClick={() => {
              setTab("signup");
              setSignupMessage("");
            }}
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form-header">
              <h3>Welcome Back</h3>
              <p>Sign in to your account to continue shopping</p>
            </div>

            {loginMessage && (
              <div className="auth-alert-message error">
                ⚠️ {loginMessage}
              </div>
            )}

            <div className="auth-input-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={loginShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  aria-label={loginShowPassword ? "Hide password" : "Show password"}
                >
                  {loginShowPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign In to ShopEase →"}
            </button>

            <div className="auth-footer-prompt">
              Don't have an account?{" "}
              <span
                className="auth-switch-link"
                onClick={() => {
                  setTab("signup");
                  setSignupMessage("");
                }}
              >
                Create an account
              </span>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === "signup" && (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-form-header">
              <h3>Create Your Account</h3>
              <p>Join ShopEase for fast checkout and exclusive offers</p>
            </div>

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
                <label htmlFor="signup-firstname">First Name</label>
                <input
                  id="signup-firstname"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="signup-lastname">Last Name</label>
                <input
                  id="signup-lastname"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="signup-password">Password (Min 6 characters)</label>
              <div className="password-wrapper">
                <input
                  id="signup-password"
                  type={signupShowPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setSignupShowPassword(!signupShowPassword)}
                  aria-label={signupShowPassword ? "Hide password" : "Show password"}
                >
                  {signupShowPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  id="signup-confirm"
                  type={signupShowConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setSignupShowConfirm(!signupShowConfirm)}
                  aria-label={signupShowConfirm ? "Hide password" : "Show password"}
                >
                  {signupShowConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={signupLoading}
            >
              {signupLoading ? "Creating account..." : "Complete Registration →"}
            </button>

            <div className="auth-footer-prompt">
              Already have an account?{" "}
              <span
                className="auth-switch-link"
                onClick={() => {
                  setTab("login");
                  setLoginMessage("");
                }}
              >
                Sign In
              </span>
            </div>
          </form>
        )}

        {/* Security / Trust Badge */}
        <div className="auth-trust-badge">
          🔒 256-Bit SSL Encrypted & Protected by Razorpay Security
        </div>
      </div>
    </section>
  );
}

export default Auth;
