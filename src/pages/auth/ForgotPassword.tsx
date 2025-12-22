import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Added missing Link import
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";
import { Alert } from "../../components/Alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Timer logic
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      // 🛡️ SECURITY: Handle Rate Limiting explicitly
      if (error.status === 429) {
        setError("Too many requests. Please wait 60 seconds.");
        setCooldown(60);
      } else {
        setError(error.message);
      }
      return;
    }

    setSent(true);
    setCooldown(60);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We’ll send a secure password reset link to your email."
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <Alert variant="success">
            Check your email for the reset link.
          </Alert>
          
          <p className="text-sm text-slate-600">
            Didn't receive it? Check spam or try again later.
          </p>

          <button
            disabled={cooldown > 0}
            onClick={handleReset}
            className="w-full rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
          >
            {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend email"}
          </button>
          
           <div className="mt-4 text-xs">
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
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
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@college.com"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Sending..." : cooldown > 0 ? `Wait ${cooldown}s` : "Send reset link"}
          </button>
          
          <div className="mt-6 text-center text-xs">
            <Link to="/login" className="text-slate-500 hover:text-slate-700">
              Return to login
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}