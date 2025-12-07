import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Helper for desktop nav link styles
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm",
      "transition-colors",
      isActive ? "text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900",
    ].join(" ");

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-100 bg-white/80 backdrop-blur">
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 sm:flex">
          {/* About (goes to landing page features section) */}
          <NavLink
            to="/About"
              className="relative hidden sm:inline-block text-slate-500 hover:text-slate-900 transition
             after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
             after:bg-indigo-600 after:transition-all after:duration-300
             hover:after:w-full"
            >
             About
          </NavLink>


          {!user && (
            <>
             <NavLink
               to="/register"
               className="relative hidden sm:inline-block text-slate-500 hover:text-slate-900 transition
               after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
               after:bg-indigo-600 after:transition-all after:duration-300
               hover:after:w-full"
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
              <NavLink to="/dashboard" className="relative hidden sm:inline-block text-slate-500 hover:text-slate-900 transition
             after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
             after:bg-indigo-600 after:transition-all after:duration-300
             hover:after:w-full">
                Dashboard
              </NavLink>
              <button
                onClick={signOut}
                className="relative hidden sm:inline-block text-slate-500 hover:text-slate-900 transition
             after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
             after:bg-indigo-600 after:transition-all after:duration-300
             hover:after:w-full"
              >
                Sign out
              </button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {/* Icon: hamburger / X */}
          <svg
            className={`h-5 w-5 ${open ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg
            className={`h-5 w-5 ${open ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.8"
              d="M6 6l12 12M18 6l-12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            <Link
              to="/#features"
              className="rounded-md px-2 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              About
            </Link>

            {!user && (
              <>
                <Link
                  to="/register"
                  className="rounded-md px-2 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="mt-1 rounded-md bg-primary px-2 py-2 text-center text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Sign in
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-md px-2 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="mt-1 rounded-md border border-slate-300 px-2 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
