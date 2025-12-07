export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-slate-400 sm:flex-row">
        <p>© {new Date().getFullYear()} SecureNotes Pro — Built for secure distribution</p>
        <div className="flex gap-4">
          <a href="#features" className="hover:text-slate-600">
            Terms
          </a>
          <a href="#features" className="hover:text-slate-600">
            Privacy
          </a>
          <a href="#features" className="hover:text-slate-600">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
