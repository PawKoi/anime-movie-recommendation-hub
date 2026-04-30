import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="logo">
          AnimeHub
        </Link>
        <nav className="nav-links">
          <NavLink to="/titles">Browse</NavLink>
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        </nav>
        <div className="auth-section">
          {isAuthenticated ? (
            <>
              <span className="user-email">{user.email}</span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
