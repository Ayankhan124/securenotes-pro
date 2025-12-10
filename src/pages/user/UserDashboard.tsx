import { useEffect, useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../lib/auth";

type Note = {
  id: string;
  title: string | null;
  subject: string | null;
  semester: string | null;
  updated_at: string | null;
};

type UserMetadata = {
  name?: string;
};

export default function UserDashboard() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
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
        setErrorMsg("Could not load notes. Please try again.");
        setNotes([]);
        setLoading(false);
        return;
      }

      setNotes((data ?? []) as Note[]);
      setLoading(false);
    })();
  }, []);

  function formatDate(iso: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  }

  function copyShareLink(e: MouseEvent, noteId: string) {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/notes/${noteId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Share link copied to clipboard.");
        })
        .catch(() => {
          alert("Share link: " + url);
        });
    } else {
      alert("Share link: " + url);
    }
  }

  const meta: UserMetadata = (user?.user_metadata || {}) as UserMetadata;

  const displayName =
    meta.name ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "Student";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Top hero row */}
        <section className="grid items-start gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Welcome card */}
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {displayName}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              All the PDFs and notes for your class live here. Open a note in
              the secure viewer, or copy a share link for your friends.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              {notes.length === 0
                ? "No notes yet – ask your class admin to upload some."
                : `${notes.length} note${notes.length > 1 ? "s" : ""} available`}
            </div>
          </div>

          {/* Session / info card */}
          <aside className="glass-card space-y-3 rounded-3xl p-5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Session security
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Signed in as</span>
              <span className="max-w-[180px] truncate text-right text-slate-500">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Watermark</span>
              <span className="text-slate-500">
                Enabled (user email + timestamp)
              </span>
            </div>
          </aside>
        </section>

        {/* Notes + Help row */}
        <section className="grid items-start gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.05fr)]">
          {/* Notes list */}
          <div className="glass-card rounded-3xl p-5">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Your notes
                </h2>
                <p className="text-xs text-slate-500">
                  Tap a note to open it in the secure viewer.
                </p>
              </div>
            </header>

            <div className="mt-4 h-px bg-slate-100" />

            {loading && (
              <p className="mt-3 text-xs text-slate-500">Loading notes…</p>
            )}

            {errorMsg && (
              <p className="mt-3 text-xs text-rose-500">{errorMsg}</p>
            )}

            {!loading && !errorMsg && notes.length === 0 && (
              <p className="mt-3 text-xs text-slate-500">
                No notes yet. Once your admin uploads PDFs, they will appear
                here automatically.
              </p>
            )}

            <div className="mt-3 space-y-2">
              {!loading &&
                !errorMsg &&
                notes.map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`}>
                    <article className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 hover:bg-slate-50">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-900">
                          {note.title || "Untitled note"}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {(note.subject || "Subject not set") +
                            (note.semester ? ` · Sem ${note.semester}` : "")}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {note.updated_at
                            ? `Updated ${formatDate(note.updated_at)}`
                            : "Recently added"}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                          PDF / images
                        </span>
                        <button
                          type="button"
                          onClick={(e) => copyShareLink(e, note.id)}
                          className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-white"
                        >
                          Copy link
                        </button>
                      </div>
                    </article>
                  </Link>
                ))}
            </div>
          </div>

          {/* Help / how it works */}
          <aside className="space-y-3">
            <div className="glass-card rounded-3xl p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                How this page works
              </h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Your class admin uploads notes on the Admin page.</li>
                <li>They appear here grouped by title, subject & semester.</li>
                <li>
                  You read everything in a watermarked viewer to keep files
                  safe.
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-3xl border-dashed p-4 text-[11px] text-slate-600">
              <p className="mb-1 font-semibold text-slate-900">
                Tip for sharing with friends
              </p>
              <p>
                Instead of sending PDFs on WhatsApp, just{" "}
                <span className="font-medium text-slate-800">
                  copy the note link
                </span>{" "}
                – they&apos;ll always see the latest version here.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
