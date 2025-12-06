import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    // simple loader while checking auth
    return <div className="min-h-screen grid place-items-center">Checking authentication…</div>;
  }

  if (!user) {
    // redirect to login, preserve attempted path (optional)
    return <Navigate to="/login" replace />;
  }

  return children;
}
