import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import AuthShell from "../../components/AuthShell";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();
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

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Create profile row immediately with role "student"
    if (data?.user?.id) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        role: "student",
        status: "active",
      });
    }

    alert("Account created. Please check your email to confirm.");
    nav("/login");
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Your account lets you access all shared notes for your semester and subjects."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Full name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            required
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            required
            placeholder="you@college.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            required
            placeholder="At least 6 characters"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-6 text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
