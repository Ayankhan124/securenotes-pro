export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-56px-56px)] flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white/80 shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 text-white p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
              SecureNotes Pro
            </p>
            <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
            <p className="mt-3 text-sm text-blue-50 leading-relaxed">
              {subtitle}
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-blue-50/90">
            <li>• Read-only, watermark-protected viewer</li>
            <li>• Every open is logged for compliance</li>
            <li>• Admin-controlled access to notes</li>
          </ul>
        </div>

        {/* Right panel */}
        <div className="p-8 md:p-10">{children}</div>
      </div>
    </div>
  );
}
