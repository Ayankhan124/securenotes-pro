// src/lib/activity.ts
import { supabase } from "../api/supabaseClient";

export type ActivityAction = "note_view" | "attachment_open";

export async function logActivity(params: {
  action: ActivityAction;
  noteId: string;
  userId?: string | null;
}) {
  const { action, noteId, userId } = params;

  try {
    const { error } = await supabase.from("activity_logs").insert({
      note_id: noteId,
      user_id: userId ?? null,
      action,
    });

    if (error) {
      console.error("Failed to log activity:", error.message);
    }
  } catch (err) {
    console.error("Unexpected error logging activity:", err);
  }
}