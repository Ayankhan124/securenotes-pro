// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../api/supabaseClient";

type UserMetadata = {
  name?: string;
  avatar_url?: string | null;
  avatar?: string | null;
  picture?: string | null;
};

export default function Header() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔐 SECURITY: Check DB for admin role instead of relying on env vars
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    let active = true;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (active && data?.role === "admin") {
        setIsAdmin(true);
      }
    })();

    return () => { active = false; };
  }, [user]);

  const meta: UserMetadata = (user?.user_metadata ?? {}) as UserMetadata;
  
  const rawAvatarUrl =
    meta.avatar_url || meta.avatar || meta.picture || undefined;

  const avatarUrl =
    typeof rawAvatarUrl === "string" && rawAvatarUrl.trim().length > 0
      ? rawAvatarUrl
      : undefined;

  const displayName =
    meta.name || user?.email?.split("@")[0] || user?.email || "Account";

  const initials = displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setProfileOpen(false);
      setMobileNavOpen(false);
      nav("/");
    }
  }

  // ... (Remainder of render code is largely the same, just ensure isAdmin is used)
  // Below is the compact render return for context
  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-sky-500 shadow-sm">
            <img src="/favicon.svg" alt="Logo" className="h-7 w-7" />
          </div>
          <div className="leading-tight">
            <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-sky-600 bg-clip-text text-sm font-semibold text-transparent">
              SecureNotes Pro
            </div>
            <div className="text-[11px] text-slate-500">College notes hub</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-5 text-xs sm:flex sm:text-sm">
            <NavLink to="/about" className={({ isActive }) => "transition-colors text-slate-500 hover:text-slate-900" + (isActive ? " font-semibold text-slate-900" : "")}>About</NavLink>
            {user && (
              <NavLink to="/dashboard" className={({ isActive }) => "transition-colors text-slate-500 hover:text-slate-900" + (isActive ? " font-semibold text-slate-900" : "")}>Dashboard</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => "transition-colors text-slate-500 hover:text-slate-900" + (isActive ? " font-semibold text-slate-900" : "")}>Admin</NavLink>
            )}
          </nav>

          {/* (Mobile Hamburger and Auth Buttons logic remains same) */}
           <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:inline-flex">Sign in</Link>
                <Link to="/register" className="inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700">Get started</Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setProfileOpen((v) => !v); setMobileNavOpen(false); }}
                  className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-xs hover:border-indigo-300"
                >
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-[11px] font-semibold text-white">
                    {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : initials}
                  </div>
                  <span className="hidden max-w-[120px] truncate sm:inline-block">{displayName}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white py-3 text-xs shadow-xl ring-1 ring-slate-900/5">
                    <div className="px-4 pb-3">
                      <p className="text-[11px] font-semibold text-slate-500">Signed in as</p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-slate-900">{user.email}</p>
                    </div>
                    <div className="mt-1 border-t border-slate-100 pt-2">
                      <button type="button" onClick={handleSignOut} className="flex items-center justify-center mx-auto rounded-lg border border-slate-200 bg-white px-14 py-1.5 text-[11px] font-medium text-rose-600 transition hover:border-rose-300 hover:bg-rose-50">Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}