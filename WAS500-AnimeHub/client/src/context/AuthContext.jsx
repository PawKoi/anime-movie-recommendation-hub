import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error?.message || "Login failed"
      };
    } finally {
      setLoading(false);
    }
  }

  // Registration no longer auto-logs in
  async function register(email, password) {
    setLoading(true);
    try {
      await registerUser(email, password);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error?.message || "Registration failed"
      };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
