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
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <LayoutShell>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 🔒 Protected User Area (Layout Route) */}
        <Route element={<ProtectedRoute><OutletWrapper /></ProtectedRoute>}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/notes/:id" element={<SecureNoteViewer />} />
        </Route>

        {/* 🛡️ Protected Admin Area */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </LayoutShell>
  );
}

// Helper to render nested child routes
import { Outlet } from "react-router-dom";
const OutletWrapper = () => <Outlet />;

export default App;