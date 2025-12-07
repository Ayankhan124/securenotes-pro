import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  // If already logged in, send them to the dashboard
  useEffect(() => {
    if (!loading && user) {
      nav("/dashboard");
    }
  }, [user, loading, nav]);

  // While we are checking the session, show a simple placeholder
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 animate-fade-in">
        <p className="text-sm text-slate-500">Checking your session…</p>
      </div>
    );
  }

  // Not logged in → show marketing / hero card
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-100 flex items-center justify-center px-4 animate-fade-in">
      <section className="w-full max-w-3xl rounded-3xl bg-white shadow-xl border border-slate-100 px-8 py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
          Welcome to <span className="text-indigo-600">SecureNotes Pro</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
          Secure, admin-controlled document viewing for sensitive data.
          Watermarked, audited, and read-only where possible — so your content
          stays inside the walls.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link to="/login">
            <button className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Sign In
            </button>
          </Link>
          <Link to="/register">
            <button className="rounded-md border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Create Account
            </button>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          Admins control access • Watermarked viewing • No downloads
        </p>
      </section>
    </main>
  );
}
