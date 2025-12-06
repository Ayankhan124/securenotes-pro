import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);

    // optional: check profile status (active)
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (userId) {
      const { data: profile } = await supabase.from("profiles").select("status").eq("id", userId).single();
      if (!profile || profile.status !== "active") {
        // sign out and block until admin approval
        await supabase.auth.signOut();
        return alert("Account not active. Contact admin.");
      }
    }

    nav("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>

        <label className="block text-sm mb-2">
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
        </label>

        <label className="block text-sm mb-4">
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
        </label>

        <button type="submit" className="w-full py-2 bg-primary text-white rounded">Sign in</button>

        <div className="mt-4 text-sm text-center">
          <Link to="/register" className="text-primary">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
