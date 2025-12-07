import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);

    nav("/dashboard");
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard", // after login
      },
    });

    if (error) alert(error.message);
    // the browser will redirect to Google → back to redirectTo
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow w-full max-w-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">User Login</h2>
          <p className="text-sm text-gray-500">
            Sign in with email or continue with Google.
          </p>
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm"
        >
          <span className="text-xl">G</span>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <label className="block text-sm">
            <span className="text-xs text-gray-600">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs text-gray-600">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded font-medium"
          >
            Sign in
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          No account yet?{" "}
          <Link to="/register" className="text-primary">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
