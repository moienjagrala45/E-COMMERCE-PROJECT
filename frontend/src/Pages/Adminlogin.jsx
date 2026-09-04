import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://192.168.0.101:5000/api/users/login",
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
        setMessage(
          data.message ||
          "Invalid admin email or password"
        );

        return;
      }

      // Sirf admin ko allow karo
      if (
        !data.user ||
        data.user.role !== "admin"
      ) {
        setMessage(
          "You are not authorized to access the Admin Panel"
        );

        return;
      }

      // Admin token save
      localStorage.setItem(
        "adminToken",
        data.token
      );

      // Admin user save
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="login-section">

      <h2>Admin Login</h2>

      <p className="login-subtitle">
        Login to access ShopEase Admin Panel
      </p>

      <form
        className="login-form"
        onSubmit={handleAdminLogin}
      >

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />


        {/* PASSWORD WITH SHOW / HIDE */}

        <div className="password-wrapper">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Admin Password"
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
            {showPassword
              ? "🙈"
              : "👁"}
          </button>

        </div>


        {/* ERROR MESSAGE */}

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}


        {/* LOGIN BUTTON */}

        <button type="submit">
          Admin Login
        </button>


        {/* CREATE ACCOUNT */}

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

export default AdminLogin;