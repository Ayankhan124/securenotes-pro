// src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/UserDashboard";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./lib/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const location = useLocation();

  // routes where we hide the main header/footer
  const authRoutes = ["/login", "/register", "/admin/login"];
  const hideChrome = authRoutes.includes(location.pathname);

  return (
    <>
      {!hideChrome && <Header />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected (user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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

        {/* Protected (admin) - we still rely on AdminDashboard to gate by email */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideChrome && <Footer />}
    </>
  );
}

export default App;
