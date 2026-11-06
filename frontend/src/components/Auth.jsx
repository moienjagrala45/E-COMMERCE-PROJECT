import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import Logo from "./Logo";
import "./Auth.css";

function Auth({ initialTab = "login", onAuthSuccess, onClose }) {
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
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupShowConfirm, setSignupShowConfirm] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // ================= EXISTING SESSION =================
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
    setTab(initialTab);
  }, [initialTab]);

  // ================= BACK TO STORE NAVIGATION FIX =================
  const handleBackToStore = () => {
    if (onClose) {
      onClose();
    }
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
    setLoginLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginMessage(data.message || "Invalid email or password.");
        setLoginLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      if (onAuthSuccess) onAuthSuccess(data);

      const redirect = new URLSearchParams(window.location.search).get("redirect");
      navigate(redirect || "/");
    } catch (err) {
      console.error("Login request error:", err);
      setLoginMessage("Server connection error. Please make sure the backend is running.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ================= SIGNUP / CREATE ACCOUNT =================
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage("");
    setSignupSuccess("");

    if (signupPassword !== confirmPassword) {
      setSignupMessage("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupMessage("Password must be at least 6 characters.");
      return;
    }

    setSignupLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const response = await fetch(getApiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: signupEmail.trim(),
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignupMessage(data.message || "Signup failed. Please try again.");
        setSignupLoading(false);
        return;
      }

      setSignupSuccess("Account created successfully! You can now sign in.");
      setTimeout(() => {
        setTab("login");
        setLoginEmail(signupEmail);
        setSignupSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Signup request error:", err);
      setSignupMessage("Server connection error. Please make sure the backend is running.");
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
    <div className="normal-auth-wrapper">
      <div className="normal-auth-card">
        {/* Brand Header */}
        <div className="normal-auth-header">
          <div className="normal-auth-logo-center">
            <Logo clickable={true} />
          </div>
          <h1 className="normal-auth-title">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="normal-auth-subtitle">
            {tab === "login"
              ? "Access your cart, addresses, and saved items."
              : "Register to place orders and manage your account."}
          </p>
        </div>

        {/* Existing Session Prompt */}
        {existingUser && (
          <div className="existing-session-banner">
            <span>Signed in as <strong>{existingUser.name || existingUser.email}</strong></span>
            <button
              type="button"
              className="switch-account-btn"
              onClick={handleLogoutExisting}
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="normal-auth-tabs">
          <button
            type="button"
            className={`normal-tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setLoginMessage("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`normal-tab-btn ${tab === "signup" ? "active" : ""}`}
            onClick={() => {
              setTab("signup");
              setSignupMessage("");
            }}
          >
            Create Account
          </button>
        </div>

        {/* ================= LOGIN FORM ================= */}
        {tab === "login" && (
          <form className="normal-auth-form" onSubmit={handleLogin}>
            {loginMessage && (
              <div className="normal-alert-error">{loginMessage}</div>
            )}

            <div className="normal-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="normal-form-field">
              <label>Password</label>
              <div className="normal-password-row">
                <input
                  type={loginShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="normal-eye-btn"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  aria-label="Toggle password visibility"
                >
                  {loginShowPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="normal-submit-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* SWITCH TO CREATE ACCOUNT */}
            <div className="normal-toggle-link">
              <span>Don't have an account? </span>
              <button
                type="button"
                className="normal-switch-btn"
                onClick={() => {
                  setTab("signup");
                  setLoginMessage("");
                }}
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* ================= CREATE ACCOUNT FORM ================= */}
        {tab === "signup" && (
          <form className="normal-auth-form" onSubmit={handleSignup}>
            {signupMessage && (
              <div className="normal-alert-error">{signupMessage}</div>
            )}
            {signupSuccess && (
              <div className="normal-alert-success">{signupSuccess}</div>
            )}

            <div className="normal-name-grid">
              <div className="normal-form-field">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="normal-form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="normal-form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="normal-form-field">
              <label>Password (min. 6 characters)</label>
              <div className="normal-password-row">
                <input
                  type={signupShowPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="normal-eye-btn"
                  onClick={() => setSignupShowPassword(!signupShowPassword)}
                  aria-label="Toggle password visibility"
                >
                  {signupShowPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="normal-form-field">
              <label>Confirm Password</label>
              <div className="normal-password-row">
                <input
                  type={signupShowConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="normal-eye-btn"
                  onClick={() => setSignupShowConfirm(!signupShowConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {signupShowConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="normal-submit-btn" disabled={signupLoading}>
              {signupLoading ? "Creating account..." : "Create Account"}
            </button>

            {/* SWITCH TO SIGN IN */}
            <div className="normal-toggle-link">
              <span>Already have an account? </span>
              <button
                type="button"
                className="normal-switch-btn"
                onClick={() => {
                  setTab("login");
                  setSignupMessage("");
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* PROPER BACK TO STORE NAVIGATION LINK */}
        <div className="normal-back-link">
          <button
            type="button"
            className="normal-back-link-btn"
            onClick={handleBackToStore}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
