// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../lib/auth";

// TODO: change this to YOUR real admin email(s)
const ADMIN_EMAILS = ["ayankhan4024@gmail.com"];

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  status: string | null;
};

type Note = {
  id: string;
  title: string | null;
  category?: string | null;
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // NEW: state for creating notes
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("");
  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [createNoteError, setCreateNoteError] = useState<string | null>(null);
  const [createNoteMessage, setCreateNoteMessage] = useState<string | null>(
    null
  );

  const isAdmin =
    !!user && ADMIN_EMAILS.includes((user.email || "").toLowerCase());

  // --- Guard: must be signed in ---
  if (!user) {
    return (
      <main className="page-shell min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">
          You must be signed in to view this page.
        </p>
      </main>
    );
  }

  // --- Guard: must be one of the configured admin emails ---
  if (!isAdmin) {
    return (
      <main className="page-shell min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 px-6 py-4 text-center">
          <h1 className="text-base font-semibold text-slate-900">
            Admin access only
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-sm">
            Your account is signed in as <strong>{user.email}</strong>, which is
            not listed as an admin email.
          </p>
        </div>
      </main>
    );
  }

  // ----------------- LOAD DATA -----------------

  useEffect(() => {
    loadPendingUsers();
    loadNotes();
  }, []);

  async function loadPendingUsers() {
    setLoadingUsers(true);
    setUsersError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, status")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading pending users", error);
      setUsersError(error.message);
      setPendingUsers([]);
    } else {
      setPendingUsers(data || []);
    }

    setLoadingUsers(false);
  }

  async function loadNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, category")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading notes", error);
      setNotes([]);
    } else {
      setNotes(data || []);
    }
  }

  // ----------------- APPROVE USERS -----------------

  async function handleApprove(profileId: string, makeAdmin: boolean) {
    setUsersError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        status: "active",
        role: makeAdmin ? "admin" : "user",
      })
      .eq("id", profileId);

    if (error) {
      console.error("Error approving user", error);
      setUsersError(error.message);
      return;
    }

    await loadPendingUsers();
  }

  // ----------------- CREATE NOTE (NEW) -----------------

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setCreateNoteError(null);
    setCreateNoteMessage(null);

    if (!newNoteTitle.trim()) {
      setCreateNoteError("Please enter a note title.");
      return;
    }

    setCreateNoteLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: newNoteTitle.trim(),
          category: newNoteCategory.trim() || null,
        })
        .select("id, title, category")
        .single();

      if (error) {
        console.error("Error creating note", error);
        setCreateNoteError(error.message);
        return;
      }

      // Add the new note into local list + reset form
      setNotes((prev) => [...prev, data as Note]);
      setNewNoteTitle("");
      setNewNoteCategory("");
      setCreateNoteMessage("Note created successfully.");
    } finally {
      setCreateNoteLoading(false);
    }
  }

  // ----------------- UPLOAD ATTACHMENTS -----------------

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setUploadMessage(null);

    if (!selectedNoteId) {
      setUploadError("Please choose a note first.");
      return;
    }
    if (!file) {
      setUploadError("Please choose a file (PDF or image).");
      return;
    }

    setUploadLoading(true);

    try {
      // 1) Upload the file to the storage bucket
      const bucket = "protected-files"; // must match your Supabase bucket name
      const path = `note-${selectedNoteId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) {
        console.error("Upload error", uploadError);
        setUploadError(uploadError.message);
        setUploadLoading(false);
        return;
      }

      // 2) Insert row into attachments table
      const { error: insertError } = await supabase.from("attachments").insert({
        note_id: selectedNoteId,
        name: file.name,
        path,
        mime_type: file.type || "application/octet-stream",
      });

      if (insertError) {
        console.error("Insert attachment error", insertError);
        setUploadError(insertError.message);
        setUploadLoading(false);
        return;
      }

      setUploadMessage("File uploaded and attached to the note.");
      setFile(null);
      setSelectedNoteId("");
    } finally {
      setUploadLoading(false);
    }
  }

  // ----------------- UI -----------------

  return (
    <main className="page-shell min-h-screen bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Heading */}
        <section className="glass-card p-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-500">
              Admin console
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              SecureNotes administration
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Approve new accounts and manage protected notes. You can create
              notes and attach PDFs/images which appear in the secure viewer.
            </p>
          </div>
          <div className="text-xs text-right text-slate-500">
            <div>Signed in as</div>
            <div className="font-medium text-slate-800">{user.email}</div>
            <div className="text-emerald-600 font-medium">Admin</div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 items-start">
          {/* PENDING USERS */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Pending users
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              New sign-ups appear here as <code>pending</code>. Approve them to
              allow login, or promote to admin.
            </p>

            {loadingUsers && (
              <p className="mt-4 text-xs text-slate-500">Loading users…</p>
            )}

            {usersError && (
              <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                {usersError}
              </p>
            )}

            {!loadingUsers && pendingUsers.length === 0 && !usersError && (
              <p className="mt-4 text-xs text-slate-500">
                No pending users right now.
              </p>
            )}

            <div className="mt-4 space-y-3">
              {pendingUsers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {p.name || "(no name)"}
                    </div>
                    <div className="text-xs text-slate-500">{p.email}</div>
                    <div className="mt-1 text-[11px] text-amber-600">
                      Status: {p.status || "unknown"}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleApprove(p.id, false)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Approve user
                    </button>
                    <button
                      onClick={() => handleApprove(p.id, true)}
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Approve as admin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NOTE MANAGEMENT: create + upload */}
          <div className="glass-card p-5 space-y-6">
            {/* Create note */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Create note
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Create a new note record. After that, you can attach PDFs or
                images to it using the upload section below.
              </p>

              <form onSubmit={handleCreateNote} className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Example: Quarterly Security Update"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Security, HR, Compliance…"
                  />
                </div>

                {createNoteError && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {createNoteError}
                  </p>
                )}

                {createNoteMessage && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
                    {createNoteMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={createNoteLoading}
                  className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createNoteLoading ? "Creating…" : "Create note"}
                </button>
              </form>
            </div>

            {/* Upload attachment */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Upload PDF / image
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Upload a file into the <code>protected-files</code> storage
                bucket and link it to a note. Files will show up in the secure
                viewer page.
              </p>

              <form onSubmit={handleUpload} className="mt-4 space-y-4">
                {/* Note select */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Choose note
                  </label>
                  <select
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedNoteId}
                    onChange={(e) => setSelectedNoteId(e.target.value)}
                  >
                    <option value="">Select a note…</option>
                    {notes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title || `Note ${n.id}`}
                        {n.category ? ` · ${n.category}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File input */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    File (PDF or image)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {uploadError}
                  </p>
                )}

                {uploadMessage && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
                    {uploadMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? "Uploading…" : "Upload and attach"}
                </button>
              </form>

              <p className="mt-3 text-[11px] text-slate-400">
                Tip: after uploading, open the corresponding note from the user
                dashboard. It will use the attachments table to show PDFs/images
                in the secure viewer.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
