import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      return alert(error.message);
    }

    // optional: create a profile row with status 'pending'
    // note: need anon key to insert - acceptable for simple flows but you'll enforce RLS later
    if (data?.user?.id) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        role: "user",
        status: "pending" // admin will set to active
      });
    }

    alert("Check your email. Your account will be pending until admin approval.");
    nav("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>

        <label className="block text-sm mb-2">
          <div className="text-xs text-gray-600">Full name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
        </label>

        <label className="block text-sm mb-2">
          <div className="text-xs text-gray-600">Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
        </label>

        <label className="block text-sm mb-4">
          <div className="text-xs text-gray-600">Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
        </label>

        <button type="submit" className="w-full py-2 bg-primary text-white rounded">Create account</button>
      </form>
    </div>
  );
}
