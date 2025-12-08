import React from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 px-4">
      <div className="auth-card max-w-5xl w-full grid md:grid-cols-2 bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        {/* Left gradient panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-blue-500 to-emerald-400 text-white p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
              SecureNotes Pro
            </p>
            <h1 className="mt-4 text-2xl font-semibold leading-snug">
              Welcome back <span className="inline-block">👋</span>
            </h1>
            <p className="mt-3 text-sm text-blue-50 leading-relaxed">
              Read your protected notes and PDFs in one place. Views are
              watermarked, logged, and read-only — perfect for sharing college
              notes safely.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-blue-50/90">
            <li>• Upload PDFs and images once, share with your whole class.</li>
            <li>• Your friends just pick semester + subject to download.</li>
            <li>• Works on phone and laptop with the same account.</li>
          </ul>
        </div>

        {/* Right side: page-specific content */}
        <div className="p-8 md:p-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">{title}</h2>
          <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
