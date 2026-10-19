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

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setMessage(
        "All fields are required and cannot be empty spaces."
      );

      return;
    }

    if (password.trim().length < 6) {
      setMessage(
        "Password must be at least 6 characters long."
      );

      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match"
      );

      return;
    }

    try {
      const response = await fetch(
        "https://e-commerce-project-backend-vpdz.onrender.com/api/users/register",
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

      <div className="auth-card signup-card">

        <div className="auth-heading">

          <span className="auth-badge">
            Join ShopEase
          </span>

          <h2>Create your account</h2>

          <p className="login-subtitle">
            Create an account and start shopping today
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleSignup}
        >

          <div className="name-row">

            <div className="input-group">

              <label>First Name</label>

              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <label>Last Name</label>

              <input
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
                placeholder="Create a password"
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

          <div className="input-group">

            <label>Confirm Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showConfirmPassword
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
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label="Show or hide password"
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁"}
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
            Create ShopEase Account
            <span>→</span>
          </button>

          <div className="auth-divider">
            <span>Already a member?</span>
          </div>

          <p className="auth-switch">

            Already have an account?

            <span
              onClick={() =>
                navigate("/login")
              }
            >
              Sign In
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

export default Signup;