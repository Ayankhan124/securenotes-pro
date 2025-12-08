// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

const LandingPage = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:py-14 lg:py-16">
        {/* Hero */}
        <section className="max-w-2xl space-y-5">
          <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500">
            COLLEGE NOTES HUB
          </p>

          <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            One place for all your{" "}
            <span className="text-indigo-600">class notes</span>
            <br />
            &amp; <span className="text-indigo-600">PDFs.</span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Stop forwarding the same assignments, journals and notes again and
            again on WhatsApp. Upload them once here. Your friends just open the
            site, choose their semester &amp; subject, and read or download what
            they need.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isLoggedIn && (
              <>
                <Link to="/login">
                  <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0">
                    Sign In
                  </button>
                </Link>

                <Link to="/register">
                  <button className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 active:translate-y-0">
                    Create account
                  </button>
                </Link>
              </>
            )}

            {isLoggedIn && (
              <Link to="/dashboard">
                <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0">
                  Go to dashboard
                </button>
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Share this website link with your classmates – they just sign in and
            instantly see the latest notes you&apos;ve uploaded.
          </p>
        </section>

        {/* Three simple feature cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              1. Upload once
            </p>
            <p className="mt-2 text-slate-700">
              You upload PDFs / images for each subject and semester.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              2. Share link
            </p>
            <p className="mt-2 text-slate-700">
              Friends visit this site instead of asking you every time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              3. Always updated
            </p>
            <p className="mt-2 text-slate-700">
              When you add or update notes, everyone sees it instantly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
