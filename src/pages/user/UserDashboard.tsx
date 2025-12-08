import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";

type Note = {
  id: string;
  title: string;
  subject: string;
  updatedAt: string;
  type: "notes" | "assignment" | "journal" | "other";
};

const mockNotes: Note[] = [
  {
    id: "1",
    title: "DBMS Unit 1 – Introduction",
    subject: "DBMS",
    updatedAt: "2 days ago",
    type: "notes",
  },
  {
    id: "2",
    title: "OOP Assignment 3 – Inheritance",
    subject: "OOP",
    updatedAt: "5 days ago",
    type: "assignment",
  },
  {
    id: "3",
    title: "CN Journal – Experiment 4",
    subject: "Computer Networks",
    updatedAt: "1 week ago",
    type: "journal",
  },
];

function typeLabel(t: Note["type"]) {
  switch (t) {
    case "notes":
      return "Lecture notes";
    case "assignment":
      return "Assignment";
    case "journal":
      return "Journal / Practical";
    default:
      return "Other";
  }
}

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* Top row: greeting + quick info */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          <section className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This is your notes dashboard. All the PDFs uploaded for your
              class will appear here — organized by subject and type so you
              don&apos;t have to ask for them again.
            </p>
          </section>

          <aside className="glass-card p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Quick info</span>
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                Beta
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>How it works</span>
              <span>Upload once · share link</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Best use</span>
              <span>Exam prep & backlog</span>
            </div>
          </aside>
        </div>

        {/* Notes list + info */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          {/* Notes list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Latest uploads
              </h2>
              <p className="text-xs text-slate-500">
                Click a card to open the PDF or file.
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
                        {note.subject} · Updated {note.updatedAt}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="badge-pill border bg-slate-50 text-slate-700 border-slate-200">
                        {typeLabel(note.type)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Tap to view in browser
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Right column: small help panel */}
          <aside className="space-y-3">
            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                Tips for using this site
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Check here first before asking friends for any PDF.</li>
                <li>Use desktop or tablet for comfortable reading.</li>
                <li>Bookmark this site so you don&apos;t lose the link.</li>
              </ul>
            </div>

            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                Need a missing PDF?
              </h3>
              <p>
                If some subject or assignment is missing, ping the owner of
                this site so they can upload it once for everyone.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
