import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

const Register: React.FC = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
      return;
    }

    // Optional: create a profile row with "pending" status
    if (data?.user?.id) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        role: "user",
        status: "pending", // admin will change to "active"
      });
    }

    setLoading(false);
    alert(
      "Account created. Check your email to confirm. Access will remain pending until an admin approves you."
    );
    nav("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-slate-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
        {/* Left: welcome / marketing panel */}
        <section className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 text-white p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
              SecureNotes Pro
            </p>
            <h1 className="mt-4 text-2xl font-semibold">
              Create your account ✨
            </h1>
            <p className="mt-3 text-sm text-blue-50 leading-relaxed">
              Request access to view high-sensitivity documents in a protected,
              read-only viewer. Every read is logged, and downloads are blocked
              where possible.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-blue-50/90">
            <li>• Admins must approve new accounts before access is granted</li>
            <li>• Views are watermarked with your identity + timestamp</li>
            <li>• No copy-paste or downloads where protections are supported</li>
          </ul>
        </section>

        {/* Right: form panel */}
        <section className="p-8 md:p-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Create account
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Your account will be reviewed by an administrator before access is
            granted.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="Ayyan Khan"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
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
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
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
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </span>
            <span className="text-slate-400">
              Need help? Contact your administrator.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
