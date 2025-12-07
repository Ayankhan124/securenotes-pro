import React, { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

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
      options: { data: { name } },
    });

    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
      return;
    }

    // create / update profile row
    if (data?.user?.id) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        role: "user",
        status: "pending", // admin will set to active
      });
    }

    setLoading(false);
    alert(
      "Account requested. An administrator will review and activate your access."
    );
    nav("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        {/* Left panel – same style as login, different text */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 text-white p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
              SECURENOTES PRO
            </p>
            <h1 className="mt-4 text-2xl font-semibold">
              Create your account ✨
            </h1>
            <p className="mt-3 text-sm text-blue-50 leading-relaxed">
              Request access to view protected notes. Your account will be
              reviewed by an administrator before access is granted.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-blue-50/90">
            <li>• Designed for high-sensitivity content</li>
            <li>• Read-only, watermarked viewing</li>
            <li>• Every open is logged for compliance</li>
          </ul>
        </div>

        {/* Right panel – form */}
        <div className="p-8 md:p-10">
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
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="Ayaan Khan"
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
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-xs text-slate-500 flex justify-between">
            <span>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
