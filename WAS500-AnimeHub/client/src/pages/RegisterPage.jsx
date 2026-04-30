import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!email || !password || !confirm) {
      setFormError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    const result = await register(email, password);
    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setSuccessMessage("Registration successful. Please log in.");
    // Optional short delay then redirect, or redirect immediately:
    navigate("/login");
  }

  return (
    <section className="page auth-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">
              Confirm Password
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {formError && <p className="form-error">{formError}</p>}
        {successMessage && <p>{successMessage}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </section>
  );
}