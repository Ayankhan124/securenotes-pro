export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-10">
        {/* Hero */}
        <section className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-indigo-500">
            ABOUT
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            SecureNotes Pro · College notes hub
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            SecureNotes Pro keeps all your class PDFs and notes in one clean
            dashboard, but opens them in a{" "}
            <span className="font-medium text-slate-800">
              protected, watermarked viewer
            </span>
            . Built for students who share resources without chaos.
          </p>
        </section>

        {/* Value cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Read-only viewer",
              text: "Notes open in a secure viewer with watermarks to discourage re-sharing.",
            },
            {
              title: "Semester organization",
              text: "Quickly filter by semester and subject instead of digging through chats.",
            },
            {
              title: "Admin-managed",
              text: "One trusted admin keeps everything clean and consistent for the class.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {f.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {f.text}
              </p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            How SecureNotes Pro works
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            {[
              "Admins create notes for each subject & semester.",
              "PDFs and images are uploaded once into that note.",
              "Students access everything from a secure dashboard.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Why not just WhatsApp or Drive?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Because SecureNotes Pro is built only for class notes — not chatting,
            not storage clutter. It gives{" "}
            <span className="font-medium text-slate-800">
              fast access, clean structure, and viewer protection
            </span>{" "}
            in one place.
          </p>
        </section>

        <p className="pt-4 text-[11px] text-slate-400 text-center">
          Built with care by Ayyan Khan for students who value clean notes.
        </p>
      </div>
    </main>
  );
}
