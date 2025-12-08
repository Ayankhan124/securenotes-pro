import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const LandingPage: React.FC = () => {
  const nav = useNavigate();
  const { user } = useAuth();

  const handlePrimaryClick = () => {
    if (user) {
      nav("/dashboard");
    } else {
      nav("/login");
    }
  };

  const handleSecondaryClick = () => {
    nav("/register");
  };

  return (
    <main className="page-shell bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-4 py-10 md:flex-row md:py-16">
        {/* Left side – hero text */}
        <div className="max-w-xl space-y-5">
          <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500">
            COLLEGE NOTES HUB
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            One place for all your{" "}
            <span className="text-indigo-600">class notes</span>
            <br />
            &amp; <span className="text-indigo-600">PDFs</span>.
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            Stop forwarding the same assignments, journals, and notes again and
            again on WhatsApp. Upload them once here. Your friends just open
            the site, choose their semester &amp; subject, and read or download
            what they need.
          </p>

          {/* Primary / secondary buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrimaryClick}
              className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-indigo-700 hover:shadow-md"
            >
              {user ? "Go to your notes" : "Sign In"}
            </button>

            {/* Only show “Create account” if NOT logged in */}
            {!user && (
              <button
                onClick={handleSecondaryClick}
                className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-50"
              >
                Create account
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Share this website link with your classmates – they just sign in and
            instantly see the latest notes you&apos;ve uploaded.
          </p>
        </div>

        {/* Right side – example card */}
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between text-xs">
            <div className="font-semibold text-slate-500">EXAMPLE VIEW</div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
              Your site
            </span>
          </div>

          <h2 className="text-sm font-semibold text-slate-900">
            Sem 4 · CSE Notes
          </h2>

          <div className="mt-3 space-y-3 text-xs">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">
                  Operating Systems – Assignments
                </p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Sem 4
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Subject: Operating Systems · PDF + images
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">DBMS – Lab Journal</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Sem 4
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Shared with your whole class.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">
                  Maths – Important Formulas
                </p>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                  Sem 2
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Quick revision before exams.
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            This is just a preview card to show how your real dashboard feels
            once you start uploading notes.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
