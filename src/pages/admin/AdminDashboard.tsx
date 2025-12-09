// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

type Note = {
  id: string;
  title: string;
  subject: string | null;
  semester: string | null;
  created_at: string;
};

type Attachment = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
  created_at: string;
};

type ActivityRow = {
  id: string;
  action: string;
  created_at: string;
  note_id: string | null;
};

export default function AdminDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [recentUploads, setRecentUploads] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  // form state (create / edit)
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newSemester, setNewSemester] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // upload state
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const nav = useNavigate();

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  async function loadRecentUploads() {
    try {
      const { data, error } = await supabase
        .from("attachments")
        .select("id, note_id, name, mime_type, path, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Load attachments error:", error);
        return;
      }

      setRecentUploads((data || []) as Attachment[]);
    } catch (err) {
      console.error("Unexpected recent uploads error:", err);
    }
  }

  // Load notes + recent uploads
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: notesData, error: notesErr } = await supabase
          .from("notes")
          .select("id, title, subject, semester, created_at")
          .order("created_at", { ascending: false });

        if (notesErr) {
          console.error("Load notes error:", notesErr);
        } else if (notesData) {
          setNotes(notesData as Note[]);
        }

        await loadRecentUploads();
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------------------------------------------
  // Note create / update
  // ---------------------------------------------------------------------------

  async function handleCreateOrUpdateNote(e: FormEvent) {
    e.preventDefault();

    if (!newTitle.trim() || !newSubject.trim() || !newSemester.trim()) {
      alert("Please fill title, subject and semester.");
      return;
    }

    const payload = {
      title: newTitle.trim(),
      subject: newSubject.trim(),
      semester: newSemester.trim(),
    };

    if (editingNoteId) {
      // UPDATE existing note
      const { data, error } = await supabase
        .from("notes")
        .update(payload)
        .eq("id", editingNoteId)
        .select("id, title, subject, semester, created_at")
        .single();

      if (error || !data) {
        console.error("Update note error:", error);
        alert("Failed to update note.");
        return;
      }

      setNotes((prev) =>
        prev.map((n) => (n.id === editingNoteId ? (data as Note) : n)),
      );

      setEditingNoteId(null);
      setNewTitle("");
      setNewSubject("");
      setNewSemester("");
      alert("Note updated.");
    } else {
      // INSERT new note (body is NOT NULL in DB)
      const { data, error } = await supabase
        .from("notes")
        .insert({
          ...payload,
          body: "", // prevents "body not-null" error
        })
        .select("id, title, subject, semester, created_at")
        .single();

      if (error || !data) {
        console.error("Create note error:", error);
        alert("Failed to create note.");
        return;
      }

      const created = data as Note;
      setNotes((prev) => [created, ...prev]);
      setNewTitle("");
      setNewSubject("");
      setNewSemester("");
      setSelectedNoteId(created.id);
      alert("Note created.");
    }
  }

  function handleEdit(note: Note) {
    setEditingNoteId(note.id);
    setNewTitle(note.title);
    setNewSubject(note.subject ?? "");
    setNewSemester(note.semester ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------------------------------------------------------------------------
  // Note delete
  // ---------------------------------------------------------------------------

  async function handleDelete(noteId: string) {
    const confirmDelete = window.confirm(
      "Delete this note and its attachments? This cannot be undone.",
    );
    if (!confirmDelete) return;

    // best effort: delete attachments first
    const { error: attachErr } = await supabase
      .from("attachments")
      .delete()
      .eq("note_id", noteId);

    if (attachErr) {
      console.error("Delete attachments error:", attachErr);
    }

    const { error: noteErr } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (noteErr) {
      console.error("Delete note error:", noteErr);
      alert("Failed to delete note.");
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setRecentUploads((prev) => prev.filter((a) => a.note_id !== noteId));
    if (selectedNoteId === noteId) setSelectedNoteId("");
    alert("Note deleted.");
  }

  // ---------------------------------------------------------------------------
  // File upload
  // ---------------------------------------------------------------------------

  async function handleUpload(e: FormEvent) {
    e.preventDefault();

    if (!selectedNoteId) {
      alert("Please select a note first.");
      return;
    }

    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    setUploading(true);

    try {
      const safeName = file.name.replace(/[^\w.-]/g, "_");
      const filePath = `${selectedNoteId}/${Date.now()}-${safeName}`;

      // 1) Upload to storage
      const { error: storageError } = await supabase.storage
        .from("secure-assets")
        .upload(filePath, file);

      if (storageError) {
        console.error("Storage upload error:", storageError);
        alert("Upload failed: " + storageError.message);
        return;
      }

      // 2) Insert into attachments table
      const { error: insertError } = await supabase.from("attachments").insert({
        note_id: selectedNoteId,
        name: file.name,
        path: filePath,
        mime_type: file.type || "application/octet-stream",
      });

      if (insertError) {
        console.error("Insert attachment error:", insertError);
        alert(
          "File uploaded but database insert failed: " + insertError.message,
        );
        return;
      }

      alert("File uploaded successfully.");
      setFile(null);
      const input = document.getElementById("file-input") as
        | HTMLInputElement
        | null;
      if (input) input.value = "";

      // refresh the “Recent uploads” card
      await loadRecentUploads();
    } finally {
      setUploading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers for display
  // ---------------------------------------------------------------------------

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString();
  }

  function label(note: Note) {
    const subject = note.subject || "Subject";
    const sem = note.semester || "Semester";
    return `${subject} · Sem ${sem}`;
  }

  const isEditing = Boolean(editingNoteId);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Page title + link to student view */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
              Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">
              Manage notes & uploads
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Create notes for each subject and semester, then attach PDFs/images
              for your classmates.
            </p>
          </div>
          <button
            onClick={() => nav("/dashboard")}
            className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
          >
            View student dashboard
          </button>
        </div>

        {/* Small stats banner */}
        <section className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-slate-500">Total notes</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {notes.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-slate-500">Recent uploads (last 5)</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {recentUploads.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-slate-500">Quick tip</p>
            <p className="mt-1 text-[11px] text-slate-600">
              Keep titles clear (e.g. &quot;DBMS – Unit 1&quot;) so students find
              the right PDF faster.
            </p>
          </div>
        </section>

        {/* Create / edit note + recent uploads */}
        <section className="grid gap-6 md:grid-cols-[2fr,1.3fr] items-start">
          {/* Create/edit form */}
          <div className="rounded-3xl bg-white/95 p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              {isEditing ? "Edit note" : "Create a new note"}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              {isEditing
                ? "Update the title, subject or semester of this note."
                : "Create a note, then upload PDFs/images in the section below."}
            </p>

            <form className="space-y-4" onSubmit={handleCreateOrUpdateNote}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. DBMS – Unit 1 notes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Semester
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 3"
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. DBMS"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {isEditing ? "Save changes" : "Create note"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNoteId(null);
                      setNewTitle("");
                      setNewSubject("");
                      setNewSemester("");
                    }}
                    className="text-xs font-medium text-slate-500 hover:underline"
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Recent uploads */}
          <div className="rounded-3xl bg-white/95 p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Recent uploads
            </h2>
            {recentUploads.length === 0 ? (
              <p className="text-xs text-slate-500">
                No files uploaded yet. Once you upload PDFs or images, they will
                appear here with their note IDs.
              </p>
            ) : (
              <ul className="space-y-2 text-xs">
                {recentUploads.map((att) => (
                  <li
                    key={att.id}
                    className="rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50"
                  >
                    <div className="font-medium text-slate-900 truncate">
                      {att.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Note ID: {att.note_id} · {att.mime_type}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Uploaded {formatDate(att.created_at)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Upload section */}
        <section className="rounded-3xl bg-white/95 p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            Attach a file to a note
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Choose a note (e.g., &quot;DBMS – Unit 1&quot;) and upload a PDF or
            image. Students will see it in the secure note viewer.
          </p>

          <form className="space-y-4" onSubmit={handleUpload}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Note
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedNoteId}
                onChange={(e) => setSelectedNoteId(e.target.value)}
              >
                <option value="">Select a note…</option>
                {notes.map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.title} — {label(note)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                File (PDF or image)
              </label>
              <input
                id="file-input"
                type="file"
                accept="application/pdf,image/*"
                className="block w-full text-xs text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading…" : "Upload file"}
            </button>
          </form>
        </section>

        {/* Notes overview */}
        <section className="rounded-3xl bg-white/95 p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Notes overview
          </h2>
          {loading ? (
            <p className="text-xs text-slate-500">Loading notes…</p>
          ) : notes.length === 0 ? (
            <p className="text-xs text-slate-500">
              No notes created yet. Use the form above to add your first note.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {note.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {label(note)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-500">
                      {formatDate(note.created_at)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="text-xs font-medium text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <AdminAnalytics />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analytics component
// ---------------------------------------------------------------------------
function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [recent, setRecent] = useState<ActivityRow[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      const since = new Date();
      since.setDate(since.getDate() - 7); // last 7 days

      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, action, created_at, note_id")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load analytics:", error.message);
        setError("Could not load analytics");
        setLoading(false);
        return;
      }

      const rows = (data || []) as ActivityRow[];
      setRecent(rows);

      const views = rows.filter((row) => row.action === "note_view").length;
      const downloads = rows.filter(
        (row) => row.action === "attachment_open",
      ).length;

      setViewCount(views);
      setDownloadCount(downloads);
      setLoading(false);
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Activity (last 7 days)
      </h2>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <div className="text-xs text-slate-500">Note views</div>
          <div className="text-xl font-semibold text-slate-900">
            {viewCount}
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <div className="text-xs text-slate-500">Attachment opens</div>
          <div className="text-xl font-semibold text-slate-900">
            {downloadCount}
          </div>
        </div>
      </div>

      <div className="max-h-60 overflow-auto rounded-lg border border-slate-100">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Note ID</th>
            </tr>
          </thead>
          <tbody>
            {recent.slice(0, 20).map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-500">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  {row.action === "note_view"
                    ? "Viewed note"
                    : row.action === "attachment_open"
                    ? "Opened attachment"
                    : row.action}
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {row.note_id ?? "—"}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
