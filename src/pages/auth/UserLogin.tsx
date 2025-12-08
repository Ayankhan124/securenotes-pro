import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../lib/auth";
import { Alert } from "../../components/Alert";

const UserLogin: React.FC = () => {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      nav("/dashboard", { replace: true });
    }
  }, [authLoading, user, nav]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  // If already logged in, redirect away from login page
  useEffect(() => {
    if (user) {
      nav("/dashboard");
    }
  }, [user, nav]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // success → go to dashboard
    nav("/dashboard");
  }

  async function handleGoogleLogin() {
  setErrorMsg("");
  setLoading(true);

  const redirectTo = `${window.location.origin}/login`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("Google login error", error);
    setErrorMsg(error.message);
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-slate-100 animate-fade-in">
        {/* Left: welcome / brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 text-white p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
              SecureNotes Pro
            </p>
            <h1 className="mt-4 text-2xl font-semibold">
              Welcome back <span className="inline-block">👋</span>
            </h1>
            <p className="mt-3 text-sm text-blue-50 leading-relaxed">
              Sign in to read your protected notes. Views are watermarked,
              audited, and strictly read-only — perfect for high-sensitivity
              information.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-blue-50/90">
            <li>• No downloads or copy-paste where supported</li>
            <li>• Every open is logged for compliance</li>
            <li>• Admins control which notes you see</li>
          </ul>
        </div>

        {/* Right: form panel */}
        <div className="p-8 md:p-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">
            Use your SecureNotes account to access protected content.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
  <Alert variant="error">
    {errorMsg}
  </Alert>
)}

            <button
  type="submit"
  disabled={loading}
  className="w-full py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium
             transition-all duration-200 ease-out
             hover:bg-indigo-700 hover:-translate-y-[1px] hover:shadow-lg
             active:translate-y-0 active:shadow-md
             disabled:opacity-60 disabled:cursor-not-allowed"
>
  {loading ? "Signing in..." : "Sign In"}
</button>
          </form>

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full py-2.5 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <span className="text-lg">G</span>
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 text-xs text-slate-500 flex justify-between">
  <span>
    Don&apos;t have an account?{" "}
    <Link
      to="/register"
      className="text-indigo-600 font-medium hover:text-indigo-700"
    >
      Create one
    </Link>
  </span>
  <span className="text-slate-400">
    Forgot password? Contact your administrator.
  </span>
</div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
