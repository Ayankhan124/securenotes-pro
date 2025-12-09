// src/pages/auth/AdminLogin.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1) Sign in with Supabase (email + password)
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError || !signInData.user) {
        console.error("Admin sign in error:", signInError);
        alert("Sign in failed: " + (signInError?.message ?? "Unknown error"));
        return;
      }

      // 2) Load the current auth user
      const { data: userRes, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userRes.user) {
        console.error("getUser error:", userError);
        alert(
          "Failed to load authenticated user: " +
            (userError?.message ?? "Unknown error"),
        );
        return;
      }

      const currentEmail = userRes.user.email;
      if (!currentEmail) {
        alert("Authenticated user has no email.");
        return;
      }

      // 3) Load profile rows by EMAIL (not by id)
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("email, role, status")
        .eq("email", currentEmail);

      if (profileError) {
        console.error("Profile query error:", profileError);
        alert(
          "Profile query error: " +
            (profileError.message ?? "Unknown error"),
        );
        return;
      }

      const profile = profileRows && profileRows[0];

      if (!profile) {
        alert("No profile row found for this email: " + currentEmail);
        return;
      }

      // 4) Check role + status
      if (profile.role !== "admin" || profile.status !== "active") {
        alert("Not an active admin account.");
        return;
      }

      // 5) Success → go to admin dashboard
      nav("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
          Admin Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
