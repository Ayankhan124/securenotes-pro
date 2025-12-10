import { supabase } from "./supabaseClient";

const BUCKET = "secure-assets"; // ← replace with the exact bucket id from Supabase

/**
 * Upload a file for a specific note.
 * Returns the storage path that is saved in the attachments table.
 */
export async function uploadNoteFile(
  noteId: string,
  file: File
): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const timestamp = Date.now();
  const filePath = `notes/${noteId}/${timestamp}-${safeName}`;

  console.log("DEBUG upload bucket =", BUCKET, "path =", filePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(error.message || "Failed to upload file");
  }

  return filePath;
}

/**
 * Get a signed URL so the user can download/view the attachment.
 */
export async function getSignedFileUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutes

  if (error || !data?.signedUrl) {
    console.error("Signed URL error:", error);
    throw new Error(error?.message || "Failed to create signed URL");
  }

  return data.signedUrl;
}
