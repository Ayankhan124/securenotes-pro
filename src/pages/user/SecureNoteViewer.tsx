// src/pages/user/SecureNoteViewer.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { getSignedFileUrl } from "../../api/storageClient";
import { useAuth } from "../../lib/auth";
import { logActivity } from "../../lib/activity";

type AttachmentRow = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
  created_at: string | null;
};

type SignedAttachment = AttachmentRow & { url: string };

type NoteRow = {
  id: string;
  title: string | null;
  subject: string | null;
  semester: string | null;
  body: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const SecureNoteViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState<NoteRow | null>(null);
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErrorMsg("Note not found.");
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      // 1) Load note details
      const { data: noteData, error: noteErr } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (noteErr || !noteData) {
        console.error("Note load error", noteErr);
        setErrorMsg("Could not find this note.");
        setLoading(false);
        return;
      }

      setNote(noteData as NoteRow);

      // 2) Log that this user viewed this note
      try {
        await logActivity({
          action: "note_view",
          noteId: noteData.id,
          userId: user?.id ?? null,
        });
      } catch (e) {
        console.error("Error logging note view", e);
      }

      // 3) Load attachments for this note
      const { data: attRows, error: attErr } = await supabase
        .from("attachments")
        .select("*")
        .eq("note_id", id)
        .order("created_at", { ascending: true });

      if (attErr) {
        console.error("Attachment load error", attErr);
        setErrorMsg("Could not load attachments for this note.");
        setLoading(false);
        return;
      }

      const rows = (attRows || []) as AttachmentRow[];

      const signed: SignedAttachment[] = [];
      for (const row of rows) {
        const url = await getSignedFileUrl(row.path);
        if (url) {
          signed.push({ ...row, url });
        }
      }

      setAttachments(signed);
      setActiveId(signed[0]?.id || null);
      setLoading(false);
    }

    load();
  }, [id, user?.id]);

  const activeAttachment =
    attachments.find((a) => a.id === activeId) || attachments[0] || null;

  function formatDate(iso: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  }

  const watermarkUser = user?.email ?? "your account";

  // Log when user opens the attachment in a new tab
  function handleOpenAttachment(att: SignedAttachment) {
    if (note?.id) {
      logActivity({
        action: "attachment_open",
        noteId: note.id,
        userId: user?.id ?? null,
      }).catch((e) => console.error("Error logging attachment open", e));
    }

    window.open(att.url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="page-shell bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Top header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => nav(-1)}
              className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900"
            >
              ← Back to dashboard
            </button>
            <h1 className="mt-2 text-lg font-semibold text-slate-900">
              {note?.title || "Note viewer"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {note?.subject || "Subject not set"} ·{" "}
              {note?.semester ? `Sem ${note.semester}` : "Semester not set"}
              {note?.updated_at && (
                <> · Updated {formatDate(note.updated_at)}</>
              )}
            </p>
          </div>

          <div className="glass-card px-4 py-3 text-[11px] text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900">
                Protected reading room
              </span>
              <span className="badge-pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                View only
              </span>
            </div>
            <p className="mt-1">
              A light watermark with{" "}
              <span className="font-mono text-slate-800">{watermarkUser}</span>{" "}
              is shown in the viewer so files aren&apos;t casually forwarded.
            </p>
          </div>
        </header>

        {/* Main content */}
        <section className="grid gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          {/* Viewer area */}
          <div className="glass-card min-h-[320px] p-4">
            {loading && (
              <p className="text-xs text-slate-500">Loading note…</p>
            )}

            {errorMsg && <p className="text-xs text-rose-500">{errorMsg}</p>}

            {!loading && !errorMsg && !activeAttachment && (
              <p className="text-xs text-slate-500">
                This note doesn&apos;t have any files attached yet. Ask your
                class admin to upload a PDF.
              </p>
            )}

            {!loading && !errorMsg && activeAttachment && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-900">
                      {activeAttachment.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {activeAttachment.mime_type || "PDF / image"} ·{" "}
                      {formatDate(activeAttachment.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAttachment(activeAttachment)}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Open in new tab
                  </button>
                </div>

                {/* Simple inline viewer for PDFs/images */}
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-900/5">
                  <iframe
                    key={activeAttachment.id}
                    src={activeAttachment.url}
                    className="h-[420px] w-full"
                    title={activeAttachment.name}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attachments list + meta */}
          <aside className="space-y-4">
            <div className="glass-card p-3 text-xs">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Attachments
              </h2>
              <div className="mt-2 space-y-1">
                {attachments.length === 0 && !loading && !errorMsg && (
                  <p className="text-xs text-slate-500">
                    No files yet for this note.
                  </p>
                )}

                {attachments.map((att) => {
                  const isActive = att.id === activeId;
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setActiveId(att.id)}
                      className={
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px]" +
                        (isActive
                          ? " bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : " hover:bg-slate-50 text-slate-600 border border-transparent")
                      }
                    >
                      <span className="truncate">{att.name}</span>
                      <span className="ml-2 flex-shrink-0 text-[10px] text-slate-400">
                        {att.mime_type || "file"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {note?.body && (
              <div className="glass-card p-3 text-xs text-slate-600">
                <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Note description
                </h2>
                <p className="whitespace-pre-wrap">{note.body}</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

export default SecureNoteViewer;
