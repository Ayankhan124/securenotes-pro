import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Password reset email sent. Check your inbox (and spam folder)."
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We’ll email you a secure link to reset your password."
    >
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="you@college.com"
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
