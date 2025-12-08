// src/components/Header.tsx
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

const ADMIN_EMAILS =
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export default function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const admin = isAdminEmail(user?.email);

  function closeMenu() {
    setMenuOpen(false);
  }

  const linkBase =
    "text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900";
  const activeClass = "text-indigo-600";

  function navLinkClass(isActive: boolean) {
    return `${linkBase} ${isActive ? activeClass : ""}`;
  }

  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
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
        <nav className="hidden items-center gap-5 sm:flex">
          <NavLink
            to="/"
            className={({ isActive }) => navLinkClass(isActive && location.pathname === "/")}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            About
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Dashboard
            </NavLink>
          )}

          {admin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              Admin
            </NavLink>
          )}

          {!user && (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : ""}`
                }
              >
                Create account
              </NavLink>
              <Link to="/login">
                <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-800">
                  Sign in
                </button>
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={signOut}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          )}
        </nav>

        {/* Mobile: sign-in or avatar + burger */}
        <div className="flex items-center gap-2 sm:hidden">
          {!user && (
            <Link to="/login" onClick={closeMenu}>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-white shadow-sm">
                Sign in
              </button>
            </Link>
          )}
          {user && (
            <span className="text-[11px] text-slate-500 max-w-[120px] truncate">
              {user.user_metadata?.name || user.email}
            </span>
          )}

          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-xs">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : ""}`
              }
            >
              About
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : ""}`
                }
              >
                Dashboard
              </NavLink>
            )}

            {admin && (
              <NavLink
                to="/admin/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : ""}`
                }
              >
                Admin
              </NavLink>
            )}

            {!user && (
              <>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                >
                  Create account
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : ""}`
                  }
                >
                  Sign in
                </NavLink>
              </>
            )}

            {user && (
              <button
                onClick={async () => {
                  await signOut();
                  closeMenu();
                }}
                className="mt-1 text-left text-xs font-medium text-red-600"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
