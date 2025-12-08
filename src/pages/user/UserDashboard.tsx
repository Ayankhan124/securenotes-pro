import { useEffect, useState } from "react";
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

const SEMESTER_OPTIONS = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];
const SUBJECT_OPTIONS = [
  "All",
  "Maths",
  "Physics",
  "Chemistry",
  "DBMS",
  "OS",
  "CN",
  "DSA",
  "Other",
];

export default function UserDashboard() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [semesterFilter, setSemesterFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading notes", error);
        setErrorMsg("Could not load your notes. Please try again.");
        setNotes([]);
        setLoading(false);
        return;
      }

      setNotes((data ?? []) as Note[]);
      setLoading(false);
    })();
  }, []);

  const filteredNotes = notes.filter((n) => {
    const semOk =
      semesterFilter === "All" ||
      (n.semester ?? "").toString() === semesterFilter;

    const subjOk =
      subjectFilter === "All" ||
      (n.subject ?? "").toLowerCase() === subjectFilter.toLowerCase();

    return semOk && subjOk;
  });

  return (
    <main className="page-shell bg-slate-50/60 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Greeting + quick info */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              All the PDFs and notes your friends need — in one place. Choose a
              semester and subject, then open the note to read it in the secure
              viewer.
            </p>
          </div>

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
        </section>

        {/* Filters */}
        <section className="glass-card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Semester</span>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SEMESTER_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All semesters" : `Sem ${opt}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Subject</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All subjects" : opt}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold">{filteredNotes.length}</span>{" "}
            notes
          </p>
        </section>

        {/* Notes list */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Your Notes
              </h2>
              <p className="text-xs text-slate-500">
                Click a note to open it in secure view.
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-10 text-sm text-slate-500">
                Loading notes…
              </div>
            )}

            {!loading && errorMsg && (
              <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {!loading && !errorMsg && filteredNotes.length === 0 && (
              <p className="py-6 text-xs text-slate-500">
                No notes match this filter yet. Try another subject or semester,
                or ask your friend (the admin) to upload some PDFs.
              </p>
            )}

            {!loading &&
              !errorMsg &&
              filteredNotes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <article className="note-card flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-slate-900">
                        {note.title || "Untitled note"}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {note.subject || "Subject not set"} · Sem{" "}
                        {note.semester || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="badge-pill bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px]">
                        PDF / images
                      </span>
                      <span className="text-[10px] text-slate-400">
                        View only • watermarked
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
          </div>

          {/* Right column: help text */}
          <aside className="space-y-3">
            <div className="glass-card p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold">
                How this site works
              </h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>All notes are uploaded once and shared with everyone.</li>
                <li>
                  Choose your semester + subject to quickly find the right PDF.
                </li>
                <li>
                  Notes open in a read-only viewer so your original files stay
                  safe.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
