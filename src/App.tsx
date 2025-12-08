// src/App.tsx
import React from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";

import UserLogin from "./pages/auth/UserLogin";
import Register from "./pages/auth/Register";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UserDashboard from "./pages/user/UserDashboard";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./lib/ProtectedRoute";
import { useAuth } from "./lib/auth";

function HomeRoute() {
  const { user, loading } = useAuth();

  // While auth is loading, render nothing (avoids flicker)
  if (loading) return null;

  // If logged in -> go straight to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in -> show marketing / sign-in page
  return <LandingPage />;
}

function App() {
  const location = useLocation();

  // Routes where we hide header + footer
  const hideChromeRoutes = ["/login", "/register", "/admin/login"];
  const hideChrome = hideChromeRoutes.includes(location.pathname);

  return (
    <>
      {!hideChrome && <Header />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <SecureNoteViewer />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard (still behind auth) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideChrome && <Footer />}
    </>
  );
}

export default App;
