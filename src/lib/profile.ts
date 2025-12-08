// src/lib/profile.ts
import type { User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";

/**
 * Make sure there's a row in `profiles` for this user.
 * Safe to call multiple times — it just updates existing row.
 */
export async function ensureProfile(user: User | null): Promise<void> {
  if (!user) return;

  const email = user.email ?? "";
  const meta = (user.user_metadata || {}) as Record<string, unknown>;

  // Try to grab a name from metadata; fallback to email.
  const name =
    (meta.name as string) ||
    (meta.full_name as string) ||
    (meta.display_name as string) ||
    email;

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      name,
      // If your profiles table has more columns like role/status,
      // they can stay with defaults in the database.
    },
    {
      onConflict: "id", // "id" is the primary key in profiles
    }
  );

  if (error) {
    console.error("Failed to ensure profile row:", error);
  }
}
