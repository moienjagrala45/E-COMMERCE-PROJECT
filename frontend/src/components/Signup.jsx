import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-pvdz.onrender.com/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Account creation failed"
        );

        return;
      }

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="login-section">

      <h2>Create Account</h2>

      <p className="login-subtitle">
        Create your ShopEase account
      </p>

      <form
        className="login-form"
        onSubmit={handleSignup}
      >

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
          required
        />

        <input
          type="email"
          placeholder="Email Address"
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
            placeholder="Password"
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

        <div className="password-wrapper">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword
              ? "🙈"
              : "👁"}
          </button>

        </div>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <button type="submit">
          Create Account
        </button>

        <p className="auth-switch">

          Already have an account?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>

        </p>

      </form>

    </section>
  );
}

export default Signup;