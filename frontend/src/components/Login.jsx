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
        "https://e-commerce-project-backend-pvdz.onrender.com/api/users/login",
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

      <h2>Welcome Back</h2>

      <p className="login-subtitle">
        Login to continue shopping
      </p>

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

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
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <button type="submit">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}

          <span
            onClick={() =>
              navigate("/signup")
            }
          >
            Create Account
          </span>
        </p>

      </form>

    </section>
  );
}

export default Login;