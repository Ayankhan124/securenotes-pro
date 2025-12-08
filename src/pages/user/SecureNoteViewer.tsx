import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const SecureNoteViewer: React.FC = () => {
  const { id: noteId } = useParams<{ id: string }>();
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;

    (async () => {
      setLoading(true);

      // 1) Get attachment rows for this note
      const { data, error } = await supabase
        .from<AttachmentRow>("attachments")
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 pb-10">
      {/* Top toolbar inside the page (global header is still above) */}
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-5 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span className="text-sm">←</span>
            Back to dashboard
          </Link>
          {noteId && (
            <span className="hidden sm:inline">
              • Viewing note <span className="font-mono text-slate-700">#{noteId}</span>
            </span>
          )}
        </div>

        <div className="hidden text-[11px] text-slate-400 sm:flex sm:flex-col sm:items-end">
          <span>Watermarked view (concept)</span>
          <span>Copy / download blocked where possible</span>
        </div>
      </div>

      {/* Main reading room card */}
      <section className="mx-auto mt-4 flex max-w-5xl flex-col gap-4 px-4 sm:px-6">
        {/* Note content placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
          <h1 className="text-lg font-semibold text-slate-900">
            Protected note
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
            Read-only student notes viewer
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            This area will eventually hold the actual note text or summary. For
            now, think of it as the cover page of your PDF or assignment. The
            important files are listed below in the attachments panel.
          </p>
        </div>

        {/* Attachments panel */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Attachments
              </h2>
              <p className="text-xs text-slate-500">
                PDFs and images for this note. Open them directly in the viewer.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
              {attachments.length} file{attachments.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && (
            <p className="mt-4 text-xs text-slate-500">Loading attachments…</p>
          )}

          {!loading && attachments.length === 0 && (
            <p className="mt-4 text-xs text-slate-500">
              No attachments for this note yet. Ask the admin to upload a PDF or
              image for this subject.
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
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">
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
    </main>
  );
};

export default SecureNoteViewer;
