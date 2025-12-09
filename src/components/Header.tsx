// src/components/Header.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const ADMIN_EMAILS =
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

export default function Header() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = (user?.user_metadata || {}) as any;
  const avatarUrl = meta.avatar_url as string | undefined;

  const displayName =
    meta.name || user?.email?.split("@")[0] || "Account";

  const isAdmin =
    !!user &&
    !!user.email &&
    ADMIN_EMAILS.includes(user.email.toLowerCase());

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setMenuOpen(false);
      nav("/");
    }
  }

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand / logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* Logo bubble using favicon.svg */}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-sky-500 shadow-sm">
            <img
              src="/favicon.svg"
              alt="SecureNotes Pro logo"
              className="h-7 w-7"
            />
          </div>

          {/* Brand text */}
          <div className="leading-tight">
            <div className="text-sm font-semibold bg-gradient-to-r from-indigo-700 via-violet-600 to-sky-600 bg-clip-text text-transparent">
              SecureNotes Pro
            </div>
            <div className="text-xs text-slate-500">College notes hub</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-xs sm:flex sm:text-sm">
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

          {isAdmin && (
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
        </nav>

        {/* Right side: auth / avatar */}
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/login"
                className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <div className="relative">
              {/* Avatar button */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm hover:border-indigo-300"
              >
                <span className="hidden max-w-[140px] truncate text-slate-700 sm:inline-block">
                  {displayName}
                </span>
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-sky-500 text-[11px] font-semibold text-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName
                      .split(" ")
                      .map((p: string) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </span>
              </button>

              {/* Dropdown panel */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-white/95 p-3 text-xs shadow-xl ring-1 ring-slate-900/5">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Signed in
                      </p>
                      <p className="mt-0.5 truncate text-[13px] font-medium text-slate-900">
                        {user.email}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {isAdmin
                          ? "Admin account · can upload & manage notes"
                          : "Student account · read notes in the viewer"}
                      </p>
                    </div>
                    <span
                      className={
                        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
                        (isAdmin
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100")
                      }
                    >
                      {isAdmin ? "Admin" : "Viewer"}
                    </span>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-medium text-white hover:bg-slate-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
