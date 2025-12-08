import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../api/supabaseClient";

type Note = {
  id: string;
  title: string;
  subject: string;
  semester: string;
  category: string | null;
  sensitivity: "high" | "medium" | "low";
  updatedAt: string; // nice formatted date string
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subjectFilter, setSubjectFilter] = useState<string>("All subjects");
  const [semesterFilter, setSemesterFilter] = useState<string>("All semesters");

  // 1) Load notes from Supabase
  useEffect(() => {
    async function loadNotes() {
      setLoading(true);

      const { data, error } = await supabase
        .from("notes")
        .select("id, title, subject, semester, category, sensitivity, updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error loading notes", error);
        setLoading(false);
        return;
      }

      const mapped: Note[] =
        (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title,
          subject: row.subject,
          semester: row.semester,
          category: row.category ?? null,
          sensitivity:
            (row.sensitivity as Note["sensitivity"]) || "low",
          updatedAt: row.updated_at
            ? new Date(row.updated_at).toLocaleDateString()
            : "",
        })) || [];

      setNotes(mapped);
      setLoading(false);
    }

    loadNotes();
  }, []);

  // 2) Build dynamic dropdown options from the notes
  const subjectOptions = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.subject) set.add(n.subject);
    });
    return ["All subjects", ...Array.from(set)];
  }, [notes]);

  const semesterOptions = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.semester) set.add(n.semester);
    });
    return ["All semesters", ...Array.from(set)];
  }, [notes]);

  // 3) Apply filters
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const subjectOk =
        subjectFilter === "All subjects" || note.subject === subjectFilter;
      const semesterOk =
        semesterFilter === "All semesters" ||
        note.semester === semesterFilter;
      return subjectOk && semesterOk;
    });
  }, [notes, subjectFilter, semesterFilter]);

  return (
    <main className="page-shell bg-slate-50/60">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* top row: greeting + security summary */}
        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="glass-card rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              {user?.user_metadata?.name || user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This dashboard lists all the notes you have access to – grouped by
              subject and semester. Open any note to view PDFs or images in the
              secure reader.
            </p>
          </section>

          <aside className="glass-card rounded-2xl bg-white/70 p-5 text-sm shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Session security</span>
              <span className="badge-pill border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Healthy
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Last sign-in</span>
              <span>Just now · this device</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Watermark</span>
              <span>Enabled (user + timestamp)</span>
            </div>
          </aside>
        </div>

        {/* filters + notes list */}
        <section className="grid items-start gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {/* Filters bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Your Notes
                </h2>
                <p className="text-xs text-slate-500">
                  Click a note to open it in secure view.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Subject</span>
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {subjectOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Semester</span>
                  <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {semesterOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes list */}
            <div className="space-y-3">
              {loading && (
                <p className="rounded-xl border border-slate-200 bg-white/70 px-4 py-6 text-center text-xs text-slate-500">
                  Loading notes…
                </p>
              )}

              {!loading && filteredNotes.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-xs text-slate-500">
                  No notes found yet. Ask the admin to upload some PDFs for your
                  subjects and semesters.
                </p>
              )}

              {!loading &&
                filteredNotes.map((note) => (
                  <Link key={note.id} to={`/notes/${note.id}`}>
                    <article className="note-card flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-md">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-900">
                          {note.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {note.subject} · {note.semester} · Updated{" "}
                          {note.updatedAt}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={
                            "badge-pill border px-2 py-0.5 text-[10px] " +
                            (note.sensitivity === "high"
                              ? "border-red-100 bg-red-50 text-red-700"
                              : note.sensitivity === "medium"
                              ? "border-amber-100 bg-amber-50 text-amber-700"
                              : "border-emerald-100 bg-emerald-50 text-emerald-700")
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

          {/* right column: info panel */}
          <aside className="space-y-3">
            <div className="glass-card rounded-2xl bg-white/70 p-4 text-xs text-slate-600 shadow-sm backdrop-blur">
              <h3 className="mb-2 text-sm font-semibold">
                How this helps in college
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Upload once, share one link with your entire class.</li>
                <li>Group notes by subject and semester for quick access.</li>
                <li>No random WhatsApp forwards – everything stays organized.</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl bg-white/70 p-4 text-xs text-slate-600 shadow-sm backdrop-blur">
              <h3 className="mb-2 text-sm font-semibold">
                Need more subjects?
              </h3>
              <p>
                Ask the admin (you!) to upload PDFs for new subjects or
                semesters so your friends can instantly access them here.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default UserDashboard;
