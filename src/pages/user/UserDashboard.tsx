// src/pages/user/UserDashboard.tsx
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

const PAGE_SIZE = 10;

export default function UserDashboard() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchNotes(0, true);
  }, []);

  async function fetchNotes(pageIndex: number, replace: boolean = false) {
    if (replace) setLoading(true);
    else setLoadingMore(true);
    
    setErrorMsg(null);

    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("notes")
      .select("id, title, subject, semester, updated_at")
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error loading notes", error);
      setErrorMsg("Could not load notes.");
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    const newNotes = (data ?? []) as Note[];
    
    // Check if we reached the end
    if (newNotes.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setNotes((prev) => replace ? newNotes : [...prev, ...newNotes]);
    setPage(pageIndex);
    
    setLoading(false);
    setLoadingMore(false);
  }

  function handleLoadMore() {
    fetchNotes(page + 1);
  }

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
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => alert("Link copied!"));
    } else {
      alert("Link: " + url);
    }
  }

  const meta: UserMetadata = (user?.user_metadata || {}) as UserMetadata;
  const displayName = meta.name || user?.email?.split("@")[0] || "Student";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <section className="grid items-start gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">Welcome back</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">{displayName}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your class notes safely. Watermarked and logged for security.
            </p>
          </div>
          <aside className="glass-card space-y-3 rounded-3xl p-5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Session</span>
              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account</span>
              <span className="max-w-[180px] truncate text-right text-slate-500">{user?.email}</span>
            </div>
          </aside>
        </section>

        <section className="grid items-start gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.05fr)]">
          <div className="glass-card rounded-3xl p-5">
            <header className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Your notes</h2>
            </header>
            <div className="mt-4 h-px bg-slate-100" />

            {loading && <p className="mt-3 text-xs text-slate-500">Loading notes…</p>}
            {errorMsg && <p className="mt-3 text-xs text-rose-500">{errorMsg}</p>}
            
            {!loading && !errorMsg && notes.length === 0 && (
              <p className="mt-3 text-xs text-slate-500">No notes found.</p>
            )}

            <div className="mt-3 space-y-2">
              {notes.map((note) => (
                <Link key={note.id} to={`/notes/${note.id}`}>
                  <article className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-slate-900">{note.title || "Untitled"}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {note.subject} {note.semester ? `· Sem ${note.semester}` : ""}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                         {note.updated_at ? `Updated ${formatDate(note.updated_at)}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => copyShareLink(e, note.id)}
                      className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-white"
                    >
                      Share
                    </button>
                  </article>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {!loading && hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more notes"}
              </button>
            )}
          </div>

          <aside className="space-y-3">
             <div className="glass-card rounded-3xl p-4 text-xs text-slate-600">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">How it works</h3>
              <ul className="ml-4 list-disc space-y-1">
                <li>Admin uploads notes.</li>
                <li>You read them here securely.</li>
                <li>Watermarks protect content.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}