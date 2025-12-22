// src/api/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// 🔐 SECURITY: Keys are now loaded from environment variables
// Make sure you have a .env file with VITE_SUPABASE_ANON_KEY defined
const supabaseUrl = "https://khwyllouuohscxmbvnhp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);