import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";

const UserLogin: React.FC = () => {
  const nav = useNavigate();

  // Email/password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google
  const [oauthLoading, setOauthLoading] = useState(false);

  // Phone OTP
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "code-sent">("idle");

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

  // 2) Google login (works on localhost + Vercel)
  async function handleGoogleLogin() {
    try {
      setOauthLoading(true);
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
    } finally {
      setOauthLoading(false);
    }
  }
  // 2b) GitHub login
  async function handleGithubLogin() {
  try {
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
  } catch (err: any) {
    setErrorMsg(err.message ?? "GitHub login failed");
  }
}

  // 3) Phone OTP - step 1: send SMS
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!phone) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    // Simple helper: if user types 10 digits, auto-prefix +91
    let formatted = phone.trim();
    if (/^\d{10}$/.test(formatted)) {
      formatted = "+91" + formatted;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: formatted,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setOtpStep("code-sent");
  }

  // 4) Phone OTP - step 2: verify code
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!phone || !otpCode) {
      setErrorMsg("Enter both phone number and code.");
      return;
    }

    let formatted = phone.trim();
    if (/^\d{10}$/.test(formatted)) {
      formatted = "+91" + formatted;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token: otpCode,
      type: "sms",
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    nav("/dashboard");
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your SecureNotes account to access protected college notes."
    >
      {/* Email/password form */}
      <form onSubmit={handleEmailPassword} className="space-y-4">
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
            placeholder="you@college.com"
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
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
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
        disabled={oauthLoading}
        className="w-full py-2.5 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="text-lg">G</span>
        <span>Continue with Google</span>
      </button>
      {/* GitHub login */}
      <button
  type="button"
  onClick={handleGithubLogin}
  className="mt-2 w-full py-2.5 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
>
  <span className="text-lg">🐱</span>
  <span>Continue with GitHub</span>
</button>



      {/* Footer links */}
      <div className="mt-6 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
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
