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
              All your college notes in one place
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
              One link for all{" "}
              <span className="text-indigo-600">notes, assignments, and journals.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Instead of forwarding PDFs to everyone again and again, upload them here
              once. Your friends can sign in and download or read everything by subject
              whenever they need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <button className="nav-cta text-sm px-4 py-2.5">
                      Go to notes dashboard
                    </button>
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="text-xs sm:text-sm text-slate-600 underline-offset-4 hover:underline"
                  >
                    Upload new notes (admin)
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
                Perfect for sharing PDFs for different subjects, semesters and lab journals
                with your whole class.
              </p>
            </div>
          </div>

          {/* Right: simple “preview” panel */}
          <div className="flex-1 max-w-md w-full">
            <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-md border border-slate-200 section-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Notes preview
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Example: BE 3rd Sem – DBMS Notes
                  </p>
                </div>
                <span className="badge-pill bg-indigo-50 text-indigo-700 border border-indigo-100">
                  PDF Notes
                </span>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3 text-[11px] text-slate-500 space-y-2">
                <p>• Upload unit-wise notes, assignments, lab manuals, and journals.</p>
                <p>• Your friends just log in once and access everything anytime.</p>
                <p>• No more searching WhatsApp chats for old PDFs.</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                  <p className="font-medium text-slate-800">For you</p>
                  <p>Upload once, share a single link with your whole class.</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                  <p className="font-medium text-slate-800">For friends</p>
                  <p>Clean dashboard with subjects and latest uploads.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section-fade-in">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Why use SecureNotes Pro for college?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                All subjects, one place
              </h3>
              <p className="text-xs text-slate-600">
                Organize PDFs by subject and semester so nobody has to ask “send notes” in
                WhatsApp every exam time.
              </p>
            </div>
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Simple login for friends
              </h3>
              <p className="text-xs text-slate-600">
                Your classmates create an account once and then can access all notes from
                any device with a browser.
              </p>
            </div>
            <div className="glass-card p-4 text-sm text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                You stay in control
              </h3>
              <p className="text-xs text-slate-600">
                You decide what to upload, can remove outdated PDFs, and keep everything
                clean and organized for your batch.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
