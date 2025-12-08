import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";

type Note = {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  sensitivity: "high" | "medium" | "low";
};

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Sample Note 1",
    category: "Security",
    updatedAt: "2 days ago",
    sensitivity: "high",
  },
  {
    id: "2",
    title: "Onboarding — Confidential",
    category: "HR",
    updatedAt: "5 days ago",
    sensitivity: "medium",
  },
  {
    id: "3",
    title: "Vendor Access Policy",
    category: "Compliance",
    updatedAt: "1 week ago",
    sensitivity: "low",
  },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        {/* Top row: greeting + session card */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start fade-in-up">
          <section className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Your dashboard lists every note you have access to. Content is protected —
              watermarked and read-only inside the secure viewer.
            </p>
          </section>

          <aside className="glass-card p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Session security</span>
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Last sign-in</span>
              <span>Just now · this device</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Watermark</span>
              <span>Enabled (user + timestamp)</span>
            </div>
          </aside>
        </div>

        {/* Notes row */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start fade-in-up">
          {/* Notes list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Your Notes</h2>
              <p className="text-xs text-slate-500">
                Click a note to open it in secure view.
              </p>
            </div>

            <div className="space-y-3">
              {mockNotes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <article className="note-card flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-slate-900">
                        {note.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {note.category} · Updated {note.updatedAt}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={
                          "badge-pill border " +
                          (note.sensitivity === "high"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : note.sensitivity === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100")
                        }
                      >
                        {note.sensitivity === "high"
                          ? "High sensitivity"
                          : note.sensitivity === "medium"
                          ? "Internal"
                          : "General"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        View only • watermarked
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Info sidebar */}
          <aside className="space-y-3">
            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                How secure viewing works
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Content opens in a read-only, watermark-protected viewer.</li>
                <li>Copy, print, and download are blocked where possible.</li>
                <li>Every open is logged for audit and compliance.</li>
              </ul>
            </div>

            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                Need access to more notes?
              </h3>
              <p>
                Contact your administrator if you believe you should see additional
                documents or categories.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
