import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
  `${API_URL}/api/auth/login`,
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

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setPage("home");
      } else {
        setMessage(
          data.message || "Invalid email or password."
        );
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setMessage(
        "Something went wrong. Check if backend is running."
      );
    }
  };

  return (
    <div className="register-page">

      {/* Background glow */}

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="register-box">

        {/* Logo */}

        <div className="auth-logo">
          SkillHub
        </div>

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to continue to your account
        </p>

        {/* Login Form */}

        <form onSubmit={handleLogin}>

          <div className="input-group">

            <label>
              Email
            </label>

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

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

        {/* Error Message */}

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        {/* Register */}

        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <button
            onClick={() =>
              setPage("register")
            }
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;