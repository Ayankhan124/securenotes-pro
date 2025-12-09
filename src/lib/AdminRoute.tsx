// src/lib/AdminRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { supabase } from "../api/supabaseClient";

type AdminRouteProps = {
  children: ReactNode;
};

/**
 * This route ONLY allows:
 * - logged-in users
 * - whose profile has role = "admin" AND status = "active"
 *
 * Everyone else is sent back to /admin/login
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [checkingRole, setCheckingRole] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      // If still loading auth state, do nothing yet
      if (loading) return;

      // If there is no user, clearly not allowed
      if (!user) {
        setIsAllowed(false);
        setCheckingRole(false);
        return;
      }

      // Fetch the profile row for this user from Supabase
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Failed to load profile in AdminRoute:", error);
        setIsAllowed(false);
        setCheckingRole(false);
        return;
      }

      const isAdmin =
        profile.role === "admin" && profile.status === "active";

      setIsAllowed(isAdmin);
      setCheckingRole(false);
    }

    checkAdmin();
  }, [user, loading]);

  // While we’re still checking auth or role → show the same spinner as ProtectedRoute
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      </div>
    );
  }

  // If not logged in or not admin → kick to admin login
  if (!user || !isAllowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Admin and active → allow
  return <>{children}</>;
}
