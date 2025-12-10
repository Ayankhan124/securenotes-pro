// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <main className="page-shell bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* HERO SECTION – single column */}
        <section className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            COLLEGE NOTES HUB
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Share your class notes with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
              zero WhatsApp chaos.
            </span>
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            SecureNotes Pro keeps all your class PDFs in one place. Upload
            notes once, tag them by subject and semester, and everyone can open
            the latest version in a read-only viewer instead of chasing files in
            random chats.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
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

          <p className="text-xs text-slate-500">
            Works best when one person from the class acts as admin and uploads
            notes for everyone.
          </p>
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
              Notes open in a protected viewer with watermarking, so it&apos;s
              made for reading and revision, not editing or deleting originals.
            </p>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Fast for everyday use
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Lightweight UI that opens quickly between classes – even on
              normal college Wi-Fi or a mobile hotspot.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
