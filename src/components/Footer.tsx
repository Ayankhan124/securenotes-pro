// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-medium text-slate-700">SecureNotes Pro</span>{" "}
          · College notes sharing hub
        </div>
        <div className="flex flex-wrap gap-3">
          <span>Made for sharing notes with friends 📚</span>
          <Link
            to="/about"
            className="hover:text-slate-800 underline underline-offset-2"
          >
            About
          </Link>
          <a
            href="mailto:you@example.com"
            className="hover:text-slate-800 underline underline-offset-2"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
