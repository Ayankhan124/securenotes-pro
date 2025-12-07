import React, { JSX, useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { uploadNoteFile } from "../../api/storageClient";

type AttachmentRow = {
  id: string;
  note_id: string;
  name: string;
  path: string;
  mime_type: string;
  created_at: string;
};

export default function AdminDashboard(): JSX.Element {
  const [noteId, setNoteId] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load attachments for the current noteId
  async function loadAttachments(targetId: string) {
    if (!targetId) {
      setAttachments([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("note_id", targetId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading attachments", error);
      alert("Could not load attachments: " + error.message);
      setIsLoading(false);
      return;
    }

    setAttachments(data ?? []);
    setIsLoading(false);
  }

  // When noteId changes, reload attachments
  useEffect(() => {
    if (noteId) {
      void loadAttachments(noteId);
    } else {
      setAttachments([]);
    }
  }, [noteId]);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    if (!e.target.files?.length) return;
    if (!noteId) {
      alert("Enter a Note ID first (it must match the /notes/:id value).");
      return;
    }

    setIsUploading(true);

    try {
      const files = Array.from(e.target.files);

      for (const file of files) {
        // 1) Upload to Supabase Storage
        const path = await uploadNoteFile(file, noteId);
        if (!path) continue;

        // 2) Save metadata in attachments table
        const { error } = await supabase.from("attachments").insert({
          note_id: noteId,
          name: file.name,
          path,
          mime_type: file.type,
        });

        if (error) {
          console.error("Insert attachment error", error);
          alert("Error saving attachment metadata: " + error.message);
        }
      }

      // reload list
      await loadAttachments(noteId);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <main className="page-shell min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              SecureNotes Pro
            </div>
            <div className="text-xs text-slate-500">
              Admin dashboard – note & file management
            </div>
          </div>

          {/* you can add a real sign-out later */}
          <button
            className="px-3 py-1 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => alert("Hook this up to your sign-out logic")}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Simple stats card */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">Total notes</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              1
            </div>
            <p className="mt-1 text-xs text-slate-500">
              (You can wire this to a real notes table later.)
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">File attachments</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {attachments.length}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              For the selected note below.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">Status</div>
            <div className="mt-1 text-sm font-medium text-emerald-600">
              Storage configured
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Files are uploaded to the private Supabase bucket.
            </p>
          </div>
        </div>

        {/* Attachments panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Attach files to a note
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            The <span className="font-mono text-[11px]">note_id</span> must
            match the value used in your URL{" "}
            <span className="font-mono text-[11px]">/notes/:id</span>.
            For example, if the user opens{" "}
            <span className="font-mono text-[11px]">
              /notes/sample-note-1
            </span>
            , enter <span className="font-mono text-[11px]">
              sample-note-1
            </span>{" "}
            below.
          </p>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Note ID
              </label>
              <input
                type="text"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value.trim())}
                placeholder="e.g. 1 or sample-note-1"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Upload PDFs / images
              </label>
              <input
                type="file"
                multiple
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="text-xs"
              />
            </div>
          </div>

          {isUploading && (
            <p className="mt-2 text-xs text-slate-500">
              Uploading files…
            </p>
          )}

          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">
                Existing attachments
              </h3>
              {isLoading && (
                <span className="text-[11px] text-slate-400">
                  Loading…
                </span>
              )}
            </div>

            {attachments.length === 0 && !isLoading && (
              <p className="mt-2 text-xs text-slate-500">
                No files yet for this note.
              </p>
            )}

            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {att.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {att.mime_type}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(att.created_at).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
