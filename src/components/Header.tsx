// src/components/Header.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = (user?.user_metadata || {}) as any;
  const avatarUrl = meta.avatar_url as string | undefined;

  const displayName =
    meta.name ||
    user?.email?.split("@")[0] ||
    "Account";

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    nav("/login");
  }

  return (
    <header className="w-full border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            SN
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-[11px] text-slate-400">
              College notes hub
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-xs sm:flex sm:text-sm">
          {/* Home intentionally removed */}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              "text-slate-500 hover:text-slate-900" +
              (isActive ? " font-semibold text-slate-900" : "")
            }
          >
            About
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                "text-slate-500 hover:text-slate-900" +
                (isActive ? " font-semibold text-slate-900" : "")
              }
            >
              Dashboard
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                "text-slate-500 hover:text-slate-900" +
                (isActive ? " font-semibold text-slate-900" : "")
              }
            >
              Admin
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className="text-slate-500 hover:text-slate-900"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/register"
                className="text-slate-500 hover:text-slate-900"
              >
                Create account
              </NavLink>
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm hover:bg-slate-50"
              >
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (displayName || "A").slice(0, 2).toUpperCase()
                  )}
                </div>
                <span className="hidden max-w-[120px] truncate sm:inline-block">
                  {displayName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                  <div className="mb-2 border-b border-slate-100 pb-2">
                    <div className="font-medium text-slate-900">
                      Signed in as
                    </div>
                    <div className="truncate text-slate-500">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile: avatar or sign-in button */}
        <div className="flex items-center gap-2 sm:hidden">
          {!user && (
            <Link
              to="/login"
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
            >
              Sign in
            </Link>
          )}

          {user && (
            <>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-100 text-[11px] font-semibold text-indigo-700"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (displayName || "A").slice(0, 2).toUpperCase()
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-3 top-12 w-56 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
                  <div className="mb-2 border-b border-slate-100 pb-2">
                    <div className="font-medium text-slate-900">
                      Signed in as
                    </div>
                    <div className="truncate text-slate-500">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
