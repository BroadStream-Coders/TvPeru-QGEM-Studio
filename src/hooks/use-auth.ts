import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = create<AuthState>(() => ({
  user: null,
  loading: true,
}));

if (typeof window !== "undefined") {
  const supabase = createClient();
  supabase.auth
    .getUser()
    .then(({ data }) => useAuth.setState({ user: data.user, loading: false }));
  supabase.auth.onAuthStateChange((_event, session) =>
    useAuth.setState({ user: session?.user ?? null, loading: false }),
  );
}
