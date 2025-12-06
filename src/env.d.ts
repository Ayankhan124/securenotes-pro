// src/env.d.ts
/// <reference types="vite/client" />
/// <reference types="react" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add other VITE_ keys here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
