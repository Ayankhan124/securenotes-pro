import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../api/supabaseClient";
import { Alert } from "../../components/Alert";

type Note = {
  id: string;
  title: string;
  subject: string | null;
  semester: string | null;
  created_at: string | null;
};

type Attachment = {
  id: string;
  note_id: string;
  name: string;
  mime_type: string;
  created_at: string | null;
};

const ADMIN_EMAILS =
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string>("");

  const isAdmin = isAdminEmail(user?.email);

  // If not logged in or not admin, don't run any admin queries
  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      setErrorMsg("");

      // Load notes
      const { data: notesData, error: notesErr } = await supabase
        .from("notes")
        .select("id, title, subject, semester, created_at")
        .order("created_at", { ascending: false });

      if (notesErr) {
        console.error("Error loading notes", notesErr);
        setErrorMsg(notesErr.message);
        setLoading(false);
        return;
      }

      const typedNotes: Note[] =
        (notesData ?? []).map((n: any) => ({
          id: n.id,
          title: n.title || "Untitled note",
          subject: n.subject,
          semester: n.semester,
          created_at: n.created_at,
        })) || [];

      setNotes(typedNotes);

      // Load attachments (just for overview)
      const { data: attData, error: attErr } = await supabase
        .from("attachments")
        .select("id, note_id, name, mime_type, created_at")
        .order("created_at", { ascending: false });

      if (attErr) {
        console.error("Error loading attachments", attErr);
        setErrorMsg(attErr.message);
        setAttachments([]);
        setLoading(false);
        return;
      }

      const typedAttachments: Attachment[] =
        (attData ?? []).map((a: any) => ({
          id: a.id,
          note_id: a.note_id,
          name: a.name,
          mime_type: a.mime_type,
          created_at: a.created_at,
        })) || [];

      setAttachments(typedAttachments);
      setLoading(false);
    }

    loadData();
  }, [user, isAdmin]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadMsg("");

    if (!user) {
      setUploadMsg("You must be signed in as admin to upload.");
      return;
    }

    if (!isAdmin) {
      setUploadMsg("Only admin accounts can upload files.");
      return;
    }

    if (!selectedNoteId) {
      setUploadMsg("Please choose a note first.");
      return;
    }

    if (!file) {
      setUploadMsg("Please choose a PDF or image file to upload.");
      return;
    }

    try {
      const bucket = "protected-files";
      const safeName = file.name.replace(/\s+/g, "-");
      const filePath = `${user.id}/${Date.now()}-${safeName}`;

      // 1) Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error", uploadError);
        setUploadMsg("Upload failed: " + uploadError.message);
        return;
      }

      // 2) Insert attachment row
      const { error: insertError } = await supabase.from("attachments").insert({
        note_id: selectedNoteId,
        name: file.name,
        path: filePath,
        mime_type: file.type,
      });

      if (insertError) {
        console.error("Insert attachment error", insertError);
        setUploadMsg("File uploaded but DB insert failed: " + insertError.message);
        return;
      }

      setUploadMsg("✅ File uploaded and linked to note.");

      // Optionally refresh attachments list
      const { data: attData } = await supabase
        .from("attachments")
        .select("id, note_id, name, mime_type, created_at")
        .order("created_at", { ascending: false });

      const typedAttachments: Attachment[] =
        (attData ?? []).map((a: any) => ({
          id: a.id,
          note_id: a.note_id,
          name: a.name,
          mime_type: a.mime_type,
          created_at: a.created_at,
        })) || [];

      setAttachments(typedAttachments);
      setFile(null);
    } catch (err: any) {
      console.error("Unexpected upload error", err);
      setUploadMsg("Unexpected error during upload.");
    }
  }

  // Not logged in: guard
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-5">
          <h1 className="text-base font-semibold text-slate-900 mb-2">
            Admin area
          </h1>
          <p className="text-sm text-slate-600">
            You need to sign in first to access the admin dashboard.
          </p>
        </div>
      </main>
    );
  }

  // Logged in but not admin: friendly message, no queries run
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-5">
          <h1 className="text-base font-semibold text-slate-900 mb-2">
            Admin access only
          </h1>
          <p className="text-sm text-slate-600">
            Your account <span className="font-mono">{user.email}</span> is not
            listed as an admin email.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            To make yourself admin, add your email to{" "}
            <code className="bg-slate-100 px-1 py-0.5 rounded">
              VITE_ADMIN_EMAILS
            </code>{" "}
            in the environment variables (in Vercel and local development).
          </p>
        </div>
      </main>
    );
  }

  // Admin view
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Admin dashboard
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              Manage notes & uploads
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Upload PDFs/images for each note, and keep an overview of what is
              available for students.
            </p>
          </div>
          <div className="rounded-full bg-white/80 border border-slate-200 px-4 py-2 text-[11px] text-slate-600 shadow-sm">
            Signed in as <span className="font-mono">{user.email}</span>
          </div>
        </header>

        {errorMsg && (
          <Alert variant="error">
            {errorMsg}
          </Alert>
        )}

        <section className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Left: upload form + notes list */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Attach a file to a note
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Choose a note (e.g., &quot;DBMS – Unit 1&quot;) and upload a PDF
                or image. Students will see it in the note viewer.
              </p>

              <form onSubmit={handleUpload} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Note
                  </label>
                  <select
                    value={selectedNoteId}
                    onChange={(e) => setSelectedNoteId(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a note…</option>
                    {notes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title} — {n.subject || "Subject"} ·{" "}
                        {n.semester || "Semester"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    File (PDF or image)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setFile(f);
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border file:border-slate-200 file:bg-white file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-50"
                  />
                </div>

                {uploadMsg && (
                  <Alert
                    variant={uploadMsg.startsWith("✅") ? "success" : "error"}
                  >
                    {uploadMsg}
                  </Alert>
                )}

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Upload file
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Notes overview
              </h2>
              {loading && (
                <p className="text-xs text-slate-500">Loading notes…</p>
              )}
              {!loading && notes.length === 0 && (
                <p className="text-xs text-slate-500">
                  No notes yet. Add some rows to the <code>notes</code> table in
                  Supabase so students can see content here.
                </p>
              )}
              {!loading && notes.length > 0 && (
                <ul className="mt-2 space-y-2 text-xs text-slate-600">
                  {notes.slice(0, 8).map((n) => (
                    <li
                      key={n.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-slate-800 font-medium">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {n.subject || "Subject"} ·{" "}
                          {n.semester || "Semester"}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {n.created_at
                          ? new Date(n.created_at).toLocaleDateString()
                          : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: attachments list */}
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Recent uploads
            </h2>
            {loading && (
              <p className="text-xs text-slate-500">Loading attachments…</p>
            )}
            {!loading && attachments.length === 0 && (
              <p className="text-xs text-slate-500">
                No files uploaded yet. Once you upload PDFs or images, they will
                appear here with their note IDs.
              </p>
            )}
            {!loading && attachments.length > 0 && (
              <ul className="mt-2 space-y-2 text-xs text-slate-600 max-h-80 overflow-auto">
                {attachments.slice(0, 15).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-slate-800">
                        {a.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Note ID:{" "}
                        <span className="font-mono">
                          {a.note_id.slice(0, 8)}…
                        </span>{" "}
                        · {a.mime_type}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString()
                        : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
