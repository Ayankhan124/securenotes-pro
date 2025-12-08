import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";
import { ensureProfile } from "./profile";

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
    // 1) Initial load
    supabase.auth.getUser().then(async (res) => {
      const u = res.data?.user ?? null;
      setUser(u);

      if (u) {
        // make sure profiles row exists for this user
        await ensureProfile(u);
      }

      setLoading(false);
    });

    // 2) Listen for future auth changes (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);

        if (u) {
          // again, ensure profile exists
          await ensureProfile(u);
        }

        setLoading(false);
      }
    );

    return () => {
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
