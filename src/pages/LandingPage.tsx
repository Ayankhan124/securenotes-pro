// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="page-shell bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* HERO SECTION */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
              COLLEGE NOTES HUB
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Share your class notes with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
                zero WhatsApp chaos.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              SecureNotes Pro is a simple website for your class: upload PDFs
              once, choose the subject &amp; semester, and everyone can open the
              latest notes in a read-only viewer. No more forwarding the same
              files again and again.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    Sign in to view notes
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Create an account
                  </Link>
                </>
              )}

              {user && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Go to your dashboard
                </Link>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Works best when one person from the class acts as admin and
              uploads all notes for everyone.
            </p>
          </div>

          {/* Right side: quick “how it works” card */}
          <div className="glass-card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              How it works
            </h2>
            <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
              <li>
                <span className="font-medium">Admin signs in</span> and creates
                notes by subject + semester.
              </li>
              <li>
                <span className="font-medium">Upload PDFs or images</span> for
                each note (unit notes, question papers, lab manuals, etc.).
              </li>
              <li>
                <span className="font-medium">Share the dashboard link</span>{" "}
                with classmates – they can filter by semester &amp; subject and
                open everything in a protected viewer.
              </li>
            </ol>
            <p className="pt-2 text-[11px] text-slate-500">
              Viewers can read everything online, but files stay stored in one
              place with your account.
            </p>
          </div>
        </section>

        {/* 3-COLUMN FEATURE STRIP */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              One link for your class
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              No more digging through old chats. Everyone bookmarks this site
              once and always finds the latest notes by semester and subject.
            </p>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Read-only viewer
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Notes open in a protected viewer. It&apos;s made for reading and
              revising, not accidentally editing or deleting the original PDFs.
            </p>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Fast for everyday use
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Built with a lightweight UI so it&apos;s quick to open between
              classes – even on average college Wi-Fi or mobile hotspots.
            </p>
          </div>
        </section>

        {/* ADMIN CALLOUT */}
        <section className="glass-card p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Are you the &quot;notes person&quot; in your group?
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              If you&apos;re the one who usually collects and shares PDFs,
              SecureNotes Pro is made for you. Upload everything once and just
              share the website link – your friends can handle the rest.
            </p>
          </div>
          <div className="flex gap-3">
            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                I&apos;m the admin – sign in
              </Link>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              View notes (after login)
            </Link>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            FAQ – quick answers
          </h2>
          <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-600">
            <div className="glass-card p-3">
              <p className="font-semibold text-slate-900">
                Do my friends need accounts?
              </p>
              <p className="mt-1">
                Yes. Each person logs in with their own account so the viewer
                can show who is reading the note.
              </p>
            </div>
            <div className="glass-card p-3">
              <p className="font-semibold text-slate-900">
                Can people download the PDFs?
              </p>
              <p className="mt-1">
                The site is designed as a read-only viewer. You can still open
                files in a new tab, but the main use is quick online access.
              </p>
            </div>
            <div className="glass-card p-3">
              <p className="font-semibold text-slate-900">
                What if I add more notes later?
              </p>
              <p className="mt-1">
                Just upload them in the admin dashboard. They instantly appear
                on everyone&apos;s dashboard under the right semester & subject.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
