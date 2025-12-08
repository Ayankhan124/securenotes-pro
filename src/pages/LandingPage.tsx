import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-20 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:pt-20">
        {/* Left: main hero text */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
            College note hub
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            One place for all your{" "}
            <span className="text-indigo-600">class notes</span> and PDFs.
          </h1>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Stop forwarding the same assignments, journals, and notes again and
            again on WhatsApp. Upload them once here. Your friends just open the
            site, pick their subject and semester, and download-free read them
            in the viewer.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/login">
              <button className="w-full rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="w-full rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 sm:w-auto">
                Create account
              </button>
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            You can share this website link with your classmates – they just
            sign in and instantly see the latest notes you’ve uploaded.
          </p>

          {/* Small “how it works” steps */}
          <div className="mt-8 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <div className="text-[11px] font-semibold text-slate-500">
                1. Upload once
              </div>
              <p className="mt-1">
                You upload PDFs / images for each subject and semester.
              </p>
            </div>
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <div className="text-[11px] font-semibold text-slate-500">
                2. Share link
              </div>
              <p className="mt-1">
                Friends visit this site instead of asking you every time.
              </p>
            </div>
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <div className="text-[11px] font-semibold text-slate-500">
                3. Always updated
              </div>
              <p className="mt-1">
                When you add or update notes, everyone sees it instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right: simple preview card */}
        <div className="mt-10 w-full max-w-md lg:mt-0 lg:flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Example view
                </p>
                <h2 className="mt-1 text-sm font-semibold text-slate-900">
                  Sem 4 · CSE Notes
                </h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                Your site
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Operating Systems – Assignments
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Sem 4
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Subject: Operating Systems · PDF + images
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    DBMS – Lab Journal
                  </span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    Sem 4
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Shared with your whole class.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    Maths – Important Formulas
                  </span>
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                    Sem 2
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Quick revision before exams.
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              This is just a preview card to show how your real dashboard feels
              once you start uploading notes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
