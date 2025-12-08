import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../api/supabaseClient";

type NoteRow = {
  id: string;
  title: string | null;
  subject: string | null;
  semester: string | null;
  updated_at: string | null;
};

export default function UserDashboard() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("notes")
        .select("id, title, subject, semester, updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading notes", error);
        setErrorMsg(error.message);
        setNotes([]);
      } else {
        setNotes(data || []);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* Top row */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          <section className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This is your notes dashboard. All uploaded PDFs (notes,
              assignments, journals) are listed below. Filter mentally by
              subject/semester or scroll through latest uploads.
            </p>
          </section>

          <aside className="glass-card p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Quick info</span>
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                Student hub
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Best time to check</span>
              <span>Before exams 😅</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Bookmark</span>
              <span>Press Ctrl + D</span>
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
                Click a card to open the note viewer.
              </p>
            </div>

            {loading && (
              <p className="text-xs text-slate-500 mt-2">Loading notes…</p>
            )}

            {errorMsg && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2 mt-2">
                {errorMsg}
              </p>
            )}

            {!loading && !errorMsg && notes.length === 0 && (
              <p className="text-xs text-slate-500 mt-2">
                No notes yet. Ask the site owner to upload some from the Admin
                console.
              </p>
            )}

            <div className="space-y-3">
              {notes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <article className="note-card flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-slate-900">
                        {note.title || "Untitled note"}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {note.subject || "General"}{" "}
                        {note.semester ? `· ${note.semester}` : ""}{" "}
                        {note.updated_at
                          ? `· Updated ${new Date(
                              note.updated_at
                            ).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="badge-pill border bg-slate-50 text-slate-700 border-slate-200">
                        PDF / file
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

          {/* Help panel */}
          <aside className="space-y-3">
            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                How to use this dashboard
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Scroll to find your subject and semester.</li>
                <li>Open PDFs directly in the browser or download from there.</li>
                <li>Revisit any time — everything stays in one place.</li>
              </ul>
            </div>

            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                Missing a subject?
              </h3>
              <p>
                If you can&apos;t find notes for a particular subject, ping the
                owner of this site so they can upload it once for everyone.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
