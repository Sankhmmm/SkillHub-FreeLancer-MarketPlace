import { useState } from "react";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! 🎉");

        setName("");
        setEmail("");
        setPassword("");
        setRole("client");

        setTimeout(() => {
          setPage("login");
        }, 1200);
      } else {
        setMessage(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      setMessage(
        "Something went wrong. Check if the backend is running."
      );
    }
  };

  return (
    <div className="register-page">

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <div className="register-box">

        <div className="auth-logo">
          SkillHub
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join SkillHub and start your journey
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">
                I want to hire freelancers
              </option>

              <option value="freelancer">
                I want to work as a freelancer
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Create Account
          </button>

        </form>

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <button
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default Register;