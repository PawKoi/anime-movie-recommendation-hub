import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    navigate("/titles");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setFormError(result.message);
      return;
    }

    navigate("/titles");
  }

return (
    <section className="page auth-page">
      <h1>Login</h1>
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
