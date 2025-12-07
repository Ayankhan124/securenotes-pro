import { supabase } from "./supabaseClient";

const BUCKET = "secure-assets";

export async function uploadNoteFile(
  file: File,
  noteId: string
): Promise<string | null> {
  // path inside bucket: notes/{noteId}/{timestamp_filename}
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `notes/${noteId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Upload error", error);
    alert(error.message);
    return null;
  }

  return filePath; // we’ll store this in the DB
}

export async function getSignedFileUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutes

  if (error) {
    console.error("Signed URL error", error);
    return null;
  }

  return data.signedUrl;
}
