import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();

  const displayName =
    (user?.user_metadata as any)?.name ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarUrl =
    (user?.user_metadata as any)?.avatar_url ||
    (user?.user_metadata as any)?.picture ||
    "";

  const email = user?.email || "";
  const phone =
    (user as any)?.phone ||
    (user?.user_metadata as any)?.phone ||
    (user?.user_metadata as any)?.phone_number ||
    "";

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    nav("/");
  }

  return (
    <header className="relative z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            SN
          </div>
          <div className="leading-tight hidden xs:block">
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-[11px] text-slate-400">College notes hub</div>
          </div>
        </Link>

        {/* Nav links + account */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <nav className="hidden sm:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                (isActive ? "text-slate-900" : "text-slate-500") +
                " hover:text-slate-900"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                (isActive ? "text-slate-900" : "text-slate-500") +
                " hover:text-slate-900"
              }
            >
              About
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  (isActive ? "text-slate-900" : "text-slate-500") +
                  " hover:text-slate-900"
                }
              >
                Dashboard
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  (isActive ? "text-slate-900" : "text-slate-500") +
                  " hover:text-slate-900"
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* When logged OUT */}
          {!user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => nav("/login")}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </button>
              <button
                onClick={() => nav("/register")}
                className="hidden sm:inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Create account
              </button>
            </div>
          )}

          {/* When logged IN */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] shadow-sm hover:border-slate-300"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-[12px] text-slate-800 max-w-[120px] truncate">
                  {displayName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-100 bg-white p-3 text-xs shadow-lg z-50">
                  <div className="mb-2 border-b border-slate-100 pb-2">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Signed in as
                    </div>
                    {email && (
                      <div className="truncate text-[12px] text-slate-800">
                        {email}
                      </div>
                    )}
                    {phone && (
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {phone}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      nav("/dashboard");
                    }}
                    className="block w-full rounded-md px-2 py-1 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                  >
                    My notes dashboard
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="mt-2 block w-full rounded-md bg-rose-50 px-2 py-1 text-left text-[12px] font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
