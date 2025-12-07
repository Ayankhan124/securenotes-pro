import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="max-w-6xl mx-auto px-6 pb-16 pt-10 lg:pt-16">
        {/* hero layout */}
        <section className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          {/* left: text + CTAs */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                • End-to-end access controls
              </span>
              <span className="badge-pill bg-indigo-50 text-indigo-700 border border-indigo-100">
                • Watermarked views
              </span>
              <span className="badge-pill bg-amber-50 text-amber-700 border border-amber-100">
                • Full audit trail
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Secure, admin-controlled{" "}
              <span className="text-primary">note sharing</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-8">
              One-way distribution for high-sensitivity content. Watermarked,
              audited and tightly permissioned — built for organizations that
              cannot tolerate leakage.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link to="/login">
                <button className="px-6 py-2.5 rounded-md bg-primary text-white text-sm font-medium shadow-sm hover:bg-indigo-800">
                  Sign in as User
                </button>
              </Link>
              <Link to="/register">
                <button className="px-5 py-2.5 rounded-md border border-slate-300 text-sm font-medium text-slate-800 bg-white hover:bg-slate-50">
                  Create account
                </button>
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Admins can approve new accounts and assign which notes each user
              can see. No downloads, no copy-paste, full visibility.
            </p>
          </div>

          {/* right: preview card */}
          <div className="hero-panel glass-card p-6 lg:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Latest note
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Quarterly Security Update — Read Only
                </h2>
              </div>
              <span className="text-xs text-slate-400">Published 2 days ago</span>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              This is a preview of how notes are presented inside SecureNotes
              Pro. Content is locked in a secure viewer with a dynamic watermark
              and protections against copy &amp; paste where supported.
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <button className="px-4 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium">
                Preview (demo)
              </button>
              <button className="px-4 py-1.5 rounded-md border border-slate-300 text-xs font-medium text-slate-700 bg-white">
                Learn more
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-slate-900/90 text-slate-100 px-3 py-2">
                <div className="font-semibold text-[11px] mb-1">
                  Lockdown view
                </div>
                <p className="text-[11px] text-slate-200/80">
                  Screenshot-resistant viewer with watermark overlay per user.
                </p>
              </div>
              <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
                <div className="font-semibold text-[11px] mb-1">
                  Admin control
                </div>
                <p className="text-[11px] text-slate-600">
                  Target notes to specific users and teams with audit logs.
                </p>
              </div>
              <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2">
                <div className="font-semibold text-[11px] mb-1">
                  Realtime alerts
                </div>
                <p className="text-[11px] text-slate-600">
                  See when sensitive notes are opened and from which device.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* bottom feature cards */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-2">Lockdown view</h3>
            <p className="text-xs text-slate-600">
              Watermarks, copy-blocking, and keyboard/print protections to
              reduce casual leaks and screenshots.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-2">Admin control</h3>
            <p className="text-xs text-slate-600">
              Create, target, and revoke access to notes. Every read is logged
              with IP, device, and timestamp.
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-2">Realtime alerts</h3>
            <p className="text-xs text-slate-600">
              Users get notified when new content is published; admins see
              engagement patterns over time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
