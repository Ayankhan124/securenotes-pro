// src/components/Header.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useState, useMemo } from "react";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ---- derived data ----------------------------------------------------
  const metadata = (user?.user_metadata || {}) as Record<string, any>;

  const displayName: string =
    metadata.name ||
    metadata.full_name ||
    metadata.user_name ||
    user?.email?.split("@")[0] ||
    "Student";

  const rawAvatar: string | undefined =
    metadata.avatar_url || metadata.picture || metadata.image;

  const avatarUrl = !avatarError && rawAvatar ? String(rawAvatar) : null;

  const initials = useMemo(() => {
    const parts = displayName.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [displayName]);

  const emailOrPhone: string | undefined =
    metadata.email || user?.email || metadata.phone || metadata.phone_number;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  // routes where header is still shown but we hide auth buttons
  const isLoggedIn = !!user;

  // ----------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white shadow-sm">
            SN
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-[11px] text-slate-400">College notes hub</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
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

          {isLoggedIn && (
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

          {isLoggedIn && (
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

          {/* Right side: auth area */}
          {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="text-slate-500 hover:text-slate-900"
              >
                Sign in
              </NavLink>
              <Link to="/register">
                <button className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:border-indigo-300 hover:text-indigo-700">
                  Create account
                </button>
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm hover:border-indigo-300"
              >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span className="max-w-[120px] truncate text-slate-800">
                  {displayName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-lg">
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                    <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {displayName}
                      </p>
                      {emailOrPhone && (
                        <p className="truncate text-[11px] text-slate-500">
                          {emailOrPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-[11px] font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile: avatar only */}
        <div className="flex items-center gap-2 sm:hidden">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  initials
                )}
              </div>
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
            >
              Sign in
            </Link>
          )}

          {menuOpen && isLoggedIn && (
            <div className="absolute right-4 top-14 w-56 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-lg sm:hidden">
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {displayName}
                  </p>
                  {emailOrPhone && (
                    <p className="truncate text-[11px] text-slate-500">
                      {emailOrPhone}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-[11px] font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
      }
