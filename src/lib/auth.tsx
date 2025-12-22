// src/lib/auth.tsx
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";
import { ensureProfile } from "./profile"; // Make sure this import is correct

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function handleSession(u: User | null) {
        if (cancelled) return;
        setUser(u);
        setLoading(false);
        // ⚡️ Automatically ensure profile exists whenever a user is detected
        if (u) {
            await ensureProfile(u);
        }
    }

    // 1) Check current user once on load
    supabase.auth.getUser().then(({ data, error }) => {
        if (error) {
            console.error("Auth check failed", error);
        }
        handleSession(data?.user ?? null);
    });

    // 2) Listen for login / logout changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session?.user ?? null);
      }
    );

    return () => {
      cancelled = true;
      sub?.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}