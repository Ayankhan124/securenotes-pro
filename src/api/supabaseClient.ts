// src/api/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://khwyllouuohscxmbvnhp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtod3lsbG91dW9oc2N4bWJ2bmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDUwNzYsImV4cCI6MjA4MDU4MTA3Nn0.dTaAf3U6Df5uejp8fqDNS_E6Gywaj2KuOYhvV_PjgDs"; // ← keep your full key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
