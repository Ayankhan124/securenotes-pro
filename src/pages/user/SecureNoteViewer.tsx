import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { getSignedFileUrl } from "../../api/storageClient";
import { Alert } from "../../components/Alert";

type NoteRow = {
  id: string;
  title: string | null;
  subject: string | null;
  semester: string | null;
  updated_at: string | null;
};

type AttachmentRow = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
};

type SignedAttachment = AttachmentRow & { url: string };

const SecureNoteViewer: React.FC = () => {
  const { id: noteId } = useParams<{ id: string }>();

  const [note, setNote] = useState<NoteRow | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [attachmentsError, setAttachmentsError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;

    (async () => {
      setLoading(true);
      setNoteError(null);
      setAttachmentsError(null);

      // 1) Load note metadata
      const { data: noteData, error: noteErr } = await supabase
        .from("notes")
        .select("id, title, subject, semester, updated_at")
        .eq("id", noteId)
        .maybeSingle(); // returns null instead of throwing if not found

      if (noteErr) {
        console.error("Error loading note", noteErr);
        setNoteError(noteErr.message);
      } else {
        setNote(noteData ?? null);
      }

      // 2) Load attachments for this note
      const { data: attRows, error: attErr } = await supabase
        .from("attachments")
        .select("*")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });

      if (attErr) {
        console.error("Error loading attachments", attErr);
        setAttachmentsError(attErr.message);
        setAttachments([]);
        setLoading(false);
        return;
      }

      const rows = attRows ?? [];
      const withUrls: SignedAttachment[] = [];

      for (const att of rows) {
        const url = await getSignedFileUrl(att.path);
        if (!url) continue;
        withUrls.push({ ...att, url });
      }

      setAttachments(withUrls);
      setLoading(false);
    })();
  }, [noteId]);

  const formattedDate =
    note?.updated_at ? new Date(note.updated_at).toLocaleDateString() : "";

  const hasNoAccessOrMissing = !loading && (!note || noteError);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 pb-10">
      {/* Top toolbar */}
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-5 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="text-sm">←</span>
            Back to dashboard
          </Link>
          {note && (
            <span className="hidden sm:inline">
              • {note.semester || "Semester"} ·{" "}
              {note.subject || "Subject"}
            </span>
          )}
        </div>

        <div className="hidden text-[11px] text-slate-400 sm:flex sm:flex-col sm:items-end">
          <span>Read-only note viewer</span>
          <span>Best used for PDFs & journals</span>
        </div>
      </div>

      {/* If note not found / no access */}
      {hasNoAccessOrMissing && (
        <section className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm">
            <h1 className="text-base font-semibold text-slate-900">
              Note not found or you don&apos;t have access
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This note may have been removed, moved to a different subject, or
              you might not have permission to view it.
            </p>
            {noteError && (
              <p className="mt-2 text-xs text-slate-400">
                Technical detail: {noteError}
              </p>
            )}
            <div className="mt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Go back to all notes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Normal note view */}
      {!hasNoAccessOrMissing && (
        <section className="mx-auto mt-4 flex max-w-5xl flex-col gap-4 px-4 sm:px-6">
          {/* Note header */}
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Protected note
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900">
              {note?.title || "Untitled note"}
            </h1>
            <p className="mt-2 text-xs text-slate-500">
              {note?.subject || "General"} · {note?.semester || "Semester"}
              {formattedDate ? ` · Updated ${formattedDate}` : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              This viewer is meant for PDFs, assignments, journals, and other
              study material shared with your class. Files below are opened in a
              read-only mode inside the browser.
            </p>
          </div>

          {/* Attachments panel */}
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Attachments
                </h2>
                <p className="text-xs text-slate-500">
                  PDFs and images for this note. Use “Open in new tab” if the
                  viewer feels small.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                {attachments.length} file
                {attachments.length === 1 ? "" : "s"}
              </span>
            </div>

            {loading && (
              <p className="mt-4 text-xs text-slate-500">
                Loading note and attachments…
              </p>
            )}

            {!loading && attachmentsError && (
  <div className="mt-4">
    <Alert variant="error">
      Could not load attachments: {attachmentsError}
    </Alert>
  </div>
)}


            {!loading && !attachmentsError && attachments.length === 0 && (
              <p className="mt-4 text-xs text-slate-500">
                No attachments have been uploaded for this note yet. Ask the
                admin to attach a PDF or images.
              </p>
            )}

            <div className="mt-5 space-y-5">
              {attachments.map((att) => {
                const isPdf = att.mime_type === "application/pdf";
                const isImage = att.mime_type.startsWith("image/");

                return (
                  <div
                    key={att.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80"
                  >
                    {/* Small file header */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                          {isPdf ? "PDF" : isImage ? "IMG" : "FILE"}
                        </span>
                        <div className="max-w-[260px] truncate text-slate-700 sm:max-w-xs">
                          {att.name}
                        </div>
                      </div>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Open in new tab
                      </a>
                    </div>

                    {/* Actual viewer */}
                    <div className="h-80 w-full bg-slate-100">
                      {isPdf && (
                        <iframe
                          src={att.url}
                          title={att.name}
                          className="h-full w-full border-0"
                        />
                      )}

                      {isImage && (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <img
                            src={att.url}
                            alt={att.name}
                            className="max-h-full w-full object-contain"
                          />
                        </div>
                      )}

                      {!isPdf && !isImage && (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-slate-500">
                          This file type is not previewable here. Use{" "}
                          <span className="mx-1 font-medium text-indigo-600">
                            “Open in new tab”
                          </span>
                          instead.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default SecureNoteViewer;
