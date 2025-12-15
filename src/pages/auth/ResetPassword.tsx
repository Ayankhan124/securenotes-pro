import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";
import { getPasswordStrength } from "../../lib/passwordStrength";

export default function ResetPassword() {
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 1️⃣ Confirm password check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // 2️⃣ Strength check
    if (!strength.isStrongEnough) {
      setError("Please choose a stronger password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // 3️⃣ Auto-login (Supabase already authenticated user)
    nav("/dashboard", { replace: true });
  }

  return (
    <AuthShell
      title="Set new password"
      subtitle="Choose a strong password for your account."
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* New password */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            New password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        {/* Password strength meter */}
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
            Password strength{" "}
            <span className="font-medium">{strength.label}</span>
          </p>
        </div>

        {/* Confirm password */}
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
