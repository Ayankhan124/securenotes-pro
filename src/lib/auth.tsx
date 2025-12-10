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

    async function init() {
      // 1) Check current user once on load
      const { data, error } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error) {
        console.error("Error getting user", error);
        setUser(null);
        setLoading(false);
        return;
      }

      const u = data?.user ?? null;
      setUser(u);
      setLoading(false);
    }

    init();

    // 2) Listen for login / logout changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return;
        const u = session?.user ?? null;
        setUser(u);
        setLoading(false);
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
