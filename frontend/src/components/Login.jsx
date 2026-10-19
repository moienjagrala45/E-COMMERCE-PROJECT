import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-vpdz.onrender.com/api/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
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

      setMessage(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="login-section">

      <div className="auth-card">

        <div className="auth-heading">

          <span className="auth-badge">
            Welcome Back
          </span>

          <h2>Sign in to ShopEase</h2>

          <p className="login-subtitle">
            Login to your account and continue shopping
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="input-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label="Show or hide password"
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>

          </div>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Sign In to ShopEase
            <span>→</span>
          </button>

          <div className="auth-divider">
            <span>New to ShopEase?</span>
          </div>

          <p className="auth-switch">

            Don't have an account?

            <span
              onClick={() =>
                navigate("/signup")
              }
            >
              Create Account
            </span>

          </p>

        </form>

        <div className="auth-footer">
          🔒 Your information is securely protected
        </div>

      </div>

    </section>
  );
}

export default Login;