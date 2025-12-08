// src/components/Header.tsx
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            SN
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-[11px] text-slate-400">
              Protected note distribution
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-xs sm:text-sm">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hidden sm:inline-block ${
                isActive ? "text-slate-900" : "text-slate-500"
              } hover:text-slate-900`
            }
          >
            About
          </NavLink>

          {!user && (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `hidden sm:inline-block ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  } hover:text-slate-900`
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
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${isActive ? "text-slate-900" : "text-slate-500"} hover:text-slate-900`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `${isActive ? "text-slate-900" : "text-slate-500"} hover:text-slate-900`
                }
              >
                Admin
              </NavLink>

              <button
                onClick={signOut}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
