export default function AboutPage() {
  return (
    <main className="page-shell bg-slate-50/60">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          About SecureNotes Pro
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          SecureNotes Pro is designed for high-sensitivity, one-way content
          distribution. Admins control who can see what, and all access is
          logged for compliance.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>Watermarked, read-only viewer.</li>
          <li>Per-user access control to notes.</li>
          <li>Audit trail for every open.</li>
        </ul>
      </div>
    </main>
  );
}
