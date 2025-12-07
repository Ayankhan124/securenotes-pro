import React, { JSX, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { getSignedFileUrl } from "../../api/storageClient";

type AttachmentRow = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
};

type SignedAttachment = AttachmentRow & { url: string };

export default function SecureNoteViewer(): JSX.Element {
  const { id: noteId } = useParams<{ id: string }>();
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;

    (async () => {
      setLoading(true);

      // 1) Get attachment rows for this note
      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading attachments", error);
        setLoading(false);
        return;
      }

      const list = data ?? [];

      // 2) For each one, create a signed URL
      const withUrls: SignedAttachment[] = [];

      for (const att of list) {
        const url = await getSignedFileUrl(att.path);
        if (!url) continue;
        withUrls.push({ ...att, url });
      }

      setAttachments(withUrls);
      setLoading(false);
    })();
  }, [noteId]);

  return (
    <main className="page-shell min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-xs text-slate-500">
              Secure note viewer (ID: {noteId})
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* You can replace this text with real note content later */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Protected note
          </h1>
          <p className="text-sm text-slate-600">
            This is a placeholder text area for the note content. Right
            now, we are focusing on displaying attached PDFs and images
            securely.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Attachments
          </h2>

          {loading && (
            <p className="mt-2 text-xs text-slate-500">Loading…</p>
          )}

          {!loading && attachments.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              No attachments for this note.
            </p>
          )}

          <div className="mt-4 space-y-4">
            {attachments.map((att) => {
              if (att.mime_type === "application/pdf") {
                return (
                  <div
                    key={att.id}
                    className="overflow-hidden rounded-lg border border-slate-200 h-80 bg-slate-50"
                  >
                    <iframe
                      src={att.url}
                      title={att.name}
                      className="w-full h-full"
                    />
                  </div>
                );
              }

              if (att.mime_type.startsWith("image/")) {
                return (
                  <div
                    key={att.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
                  >
                    <img
                      src={att.url}
                      alt={att.name}
                      className="max-h-96 w-full object-contain"
                    />
                  </div>
                );
              }

              // fallback: simple link
              return (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-primary underline"
                >
                  Open {att.name}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
