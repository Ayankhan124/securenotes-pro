import React, { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

async function handleSubmit(e: any) {
  e.preventDefault();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return alert(signInError.message);

  // get the current user id
  const userRes = await supabase.auth.getUser();
  const userId = userRes.data.user?.id;
  if (!userId) {
    return alert("Unable to determine user after login.");
  }

  // fetch profile (must exist in profiles table)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return alert("Profile not found. Contact system admin.");
  }

  if (profile.role !== "admin" || profile.status !== "active") {
    return alert("Not an active admin account.");
  }

  // success
  nav("/admin/dashboard");
}


  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full mb-3 p-2 border rounded" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="w-full py-2 bg-primary text-white rounded">Login</button>
      </form>
    </div>
  );
}
