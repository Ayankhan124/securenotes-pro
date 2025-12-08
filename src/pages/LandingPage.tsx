// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-16">
        {/* HERO */}
        <section className="hero-animated section-fade-in rounded-3xl bg-white/80 border border-slate-100 shadow-xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row md:items-center gap-10">
          {/* Left: copy */}
          <div className="flex-1 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-[11px] font-medium text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure, admin-controlled note sharing
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              Share sensitive notes{" "}
              <span className="text-indigo-600">without losing control.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              SecureNotes Pro lets admins distribute read-only, watermarked
              notes to specific users. No downloads, no copy-paste where
              supported, and every view is logged for compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <button className="nav-cta text-sm px-4 py-2.5">
                      Go to your dashboard
                    </button>
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="text-xs sm:text-sm text-slate-600 underline-offset-4 hover:underline"
                  >
                    Admin console
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="nav-cta text-sm px-4 py-2.5">
                      Sign in to view notes
                    </button>
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs sm:text-sm text-slate-600 underline-offset-4 hover:underline"
                  >
                    Request access (create account)
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-indigo-100 border border-white" />
                <div className="h-7 w-7 rounded-full bg-emerald-100 border border-white" />
                <div className="h-7 w-7 rounded-full bg-sky-100 border border-white" />
              </div>
              <p className="text-[11px] text-slate-500">
                Designed for teams handling HR, legal, security, and compliance
                docs.
              </p>
            </div>
          </div>

          {/* Right: simple “preview” panel */}
          <div className="flex-1 max-w-md w-full">
            <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 section-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Secure viewer
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Example: Quarterly Security Update
                  </p>
                </div>
                <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-100">
                  High sensitivity
                </span>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-[11px] text-slate-500 space-y-2">
                <p>
                  • Downloads and copy-paste are blocked where supported by the
                  browser.
                </p>
                <p>• Views are watermarked with user identity and timestamp.</p>
                <p>• Every open is written to an immutable audit log.</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                  <p className="font-medium text-slate-800">Admins</p>
                  <p>Publish and revoke notes, manage access, see audit trail.</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                  <p className="font-medium text-slate-800">End users</p>
                  <p>Read-only, watermarked access from web or tablet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section-fade-in">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Built for controlled distribution
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Admin-only publishing
              </h3>
              <p className="text-xs text-slate-600">
                Only admins can create and assign notes. Users simply sign in
                and read what they’re allowed to see.
              </p>
            </div>
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Watermarked, read-only viewer
              </h3>
              <p className="text-xs text-slate-600">
                Inline PDF/image viewer with watermark overlays and basic
                protections against screenshots and copy/export.
              </p>
            </div>
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Audit-ready access logs
              </h3>
              <p className="text-xs text-slate-600">
                Every open is logged in Supabase so you can answer who saw what,
                and when, during reviews or audits.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
