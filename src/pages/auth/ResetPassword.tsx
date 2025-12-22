// src/pages/auth/ResetPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";
import { getPasswordStrength } from "../../lib/passwordStrength";
import { useAuth } from "../../lib/auth"; // ✅ Import useAuth

export default function ResetPassword() {
  const nav = useNavigate();
  const { user } = useAuth(); // ✅ Get current session

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 SECURITY: If no session (link invalid/expired), don't show form
  if (!user) {
    return (
      <AuthShell title="Invalid Link" subtitle="Security Check Failed">
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-600">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => nav("/forgot-password")}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Request new link
          </button>
        </div>
      </AuthShell>
    );
  }

  const strength = getPasswordStrength(password);
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!strength.isStrongEnough) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    await supabase.auth.signOut();
    nav("/login", { replace: true });
  }

  return (
    <AuthShell
      title="Set new password"
      subtitle="Choose a strong password for your account."
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Strength Meter & Rules */}
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-slate-200">
            <div
              className={`h-1 rounded transition-all ${
                strength.score <= 1
                  ? "bg-rose-500 w-1/4"
                  : strength.score === 2
                  ? "bg-amber-500 w-2/4"
                  : strength.score === 3
                  ? "bg-indigo-500 w-3/4"
                  : "bg-emerald-500 w-full"
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Strength: <span className="font-medium">{strength.label}</span>
          </p>
        </div>

        <ul className="text-[11px] space-y-0.5">
          <li className={rules.length ? "text-emerald-600" : "text-slate-500"}>• Min 8 chars</li>
          <li className={rules.uppercase ? "text-emerald-600" : "text-slate-500"}>• 1 Uppercase</li>
          <li className={rules.number ? "text-emerald-600" : "text-slate-500"}>• 1 Number</li>
          <li className={rules.special ? "text-emerald-600" : "text-slate-500"}>• 1 Special</li>
        </ul>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Confirm password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}