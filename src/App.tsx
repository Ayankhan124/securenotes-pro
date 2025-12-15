// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LayoutShell from "./components/LayoutShell";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import UserDashboard from "./pages/user/UserDashboard";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";
import Register from "./pages/auth/Register";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./lib/ProtectedRoute";
import AdminRoute from "./lib/AdminRoute";
import { Analytics } from '@vercel/analytics/react';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { useEffect } from "react";
import { supabase } from "./api/supabaseClient";

function App() {
  return (
    <LayoutShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Auth */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Reset-password" element={<ResetPassword />} />
        {/* Student area */}
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

        {/* Admin area */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </LayoutShell>
  );
}

export default App;
