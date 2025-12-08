import { Routes, Route, useLocation } from "react-router-dom";
import LayoutShell from "./components/LayoutShell";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/LandingPage";
import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/user/UserDashboard";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./lib/ProtectedRoute";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SecureNoteViewer from "./pages/user/SecureNoteViewer";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/admin/login", "/register"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
    <>
      {!hideHeader && <Header/>}

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/notes/:id" element={
    <ProtectedRoute>
      <SecureNoteViewer />
    </ProtectedRoute>
  }
/>


        {/* Protected (user must be logged in) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
              {/* Protected (admin console) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
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

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Show footer only on “normal” pages */}
      {!hideHeader && <Footer />}
    </>
  );
}

export default App;
