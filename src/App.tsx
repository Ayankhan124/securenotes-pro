// src/App.tsx
import React, { JSX } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import UserLogin from "./pages/auth/UserLogin";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import ProtectedRoute from "./lib/ProtectedRoute";

export default function App(): JSX.Element {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
