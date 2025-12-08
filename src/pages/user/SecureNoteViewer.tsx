import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

type AttachmentRow = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
  created_at?: string | null;
};

type SignedAttachment = AttachmentRow & { url: string };

type NoteRow = {
  id: string;
  title: string | null;
  subject: string | null;
  semester: string | null;
  created_at?: string | null;
};

export const SecureNoteViewer: React.FC = () => {
  const { id: noteId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<NoteRow | null>(null);
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!noteId) return;

    (async () => {
      setLoading(true);
      setErrorMsg(null);

      // 1) Load note meta (title, subject, semester)
      const { data: noteData, error: noteErr } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .maybeSingle(); // returns null instead of throwing if not found

      if (noteErr) {
        console.error("Error loading note", noteErr);
        setErrorMsg("Could not load this note.");
        setNote(null);
        setLoading(false);
        return;
      }

      if (!noteData) {
        setErrorMsg("Note not found.");
        setLoading(false);
        return;
      }

      setNote(noteData as NoteRow);

      // 2) Load attachments for this note
      const { data: attRows, error: attErr } = await supabase
        .from("attachments")
        .select("*")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });

      if (attErr) {
        console.error("Error loading attachments", attErr);
        setErrorMsg("Could not load attachments.");
        setAttachments([]);
        setLoading(false);
        return;
      }

      const rows = (attRows ?? []) as AttachmentRow[];

      // 3) Turn storage paths into signed URLs
      const signed: SignedAttachment[] = [];

      for (const att of rows) {
        if (!att.path) continue;

        const { data: signedData, error: signedErr } = await supabase.storage
          .from("note-files")
          .createSignedUrl(att.path, 60 * 60); // 1 hour

        if (signedErr || !signedData?.signedUrl) {
          console.error("Error getting signed url", signedErr);
          continue;
        }

        signed.push({
          ...att,
          url: signedData.signedUrl,
        });
      }

      setAttachments(signed);
      setLoading(false);
    })();
  }, [noteId]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar for the viewer */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </button>

          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">
              {note?.title || "Secure PDF viewer"}
            </div>
            <div className="text-[11px] text-slate-500">
              {note?.subject && `${note.subject} · `}
              {note?.semester && `Sem ${note.semester}`}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-5xl space-y-6 px-4 pb-10">
        {/* Status / errors */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-slate-500">
            Loading note…
          </div>
        )}

        {!loading && errorMsg && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Note info */}
        {!loading && !errorMsg && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="mb-1 text-lg font-semibold text-slate-900">
              {note?.title || "Protected note"}
            </h1>
            <p className="text-sm text-slate-600">
              You&apos;re viewing this note in a protected reading room. Download
              may be disabled; screenshots or sharing outside your class is not
              recommended.
            </p>
          </div>
        )}

        {/* Attachments viewer */}
        {!loading && !errorMsg && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Attachments
            </h2>

            {attachments.length === 0 && (
              <p className="mt-2 text-xs text-slate-500">
                No PDFs or images attached to this note yet.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {attachments.map((att) => {
                if (att.mime_type === "application/pdf") {
                  return (
                    <div
                      key={att.id}
                      className="h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <iframe
                        src={att.url}
                        title={att.name}
                        className="h-full w-full"
                      />
                    </div>
                  );
                }

                if (att.mime_type.startsWith("image/")) {
                  return (
                    <div
                      key={att.id}
                      className="flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-h-[70vh] w-full object-contain"
                      />
                    </div>
                  );
                }

                // Fallback: link
                return (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-indigo-600 underline"
                  >
                    Open {att.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default SecureNoteViewer;
