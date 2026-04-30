import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TitlesListPage from "./pages/TitlesListPage";
import TitleDetailPage from "./pages/TitleDetailPage";
import TitleFormPage from "./pages/TitleFormPage";
import ProfilePage from "./pages/ProfilePage";

// imported so Vite bundles the images; used in CSS via relative paths
import "./images/forrestgump.jpg";
import "./images/onepiece.jpg";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/titles" element={<TitlesListPage />} />
          <Route path="/titles/:id" element={<TitleDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/titles/new"
            element={
              <ProtectedRoute>
                <TitleFormPage mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/titles/:id/edit"
            element={
              <ProtectedRoute>
                <TitleFormPage mode="edit" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
