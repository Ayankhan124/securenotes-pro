import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";

const UserLogin: React.FC = () => {
  const nav = useNavigate();

  // Email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OAuth loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1) Email + password login
  async function handleEmailPassword(e: React.FormEvent) {
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

    // Success → go to dashboard
    nav("/dashboard");
  }

  // 2) Google login
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Google login failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  // 3) GitHub login
  async function handleGithubLogin() {
    try {
      setGithubLoading(true);
      setErrorMsg("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("GitHub login failed");
      }
    } finally {
      setGithubLoading(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your SecureNotes account to access protected college notes."
    >
      {/* Email/password form */}
      <form onSubmit={handleEmailPassword} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@college.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        {errorMsg && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3 text-[11px] text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg">G</span>
        <span>Continue with Google</span>
      </button>

      {/* GitHub login */}
      <button
        type="button"
        onClick={handleGithubLogin}
        disabled={githubLoading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg">🐱</span>
        <span>Continue with GitHub</span>
      </button>

      {/* Footer links */}
      <div className="mt-6 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </span>
        <span className="text-slate-400">
          Forgot password? Contact your administrator.
        </span>
      </div>
    </AuthShell>
  );
};

export default UserLogin;
