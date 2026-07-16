import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  hasAccess: boolean;
  loading: boolean;
}

export const useAuth = create<AuthState>(() => ({
  user: null,
  hasAccess: false,
  loading: true,
}));

if (typeof window !== "undefined") {
  const supabase = createClient();

  const applyUser = (user: User | null) => {
    useAuth.setState({ user, hasAccess: false, loading: false });
    if (!user) return;
    setTimeout(async () => {
      const { data } = await supabase.rpc("has_production_access");
      useAuth.setState({ hasAccess: data === true });
    }, 0);
  };

  supabase.auth.getUser().then(({ data }) => applyUser(data.user));
  supabase.auth.onAuthStateChange((_event, session) =>
    applyUser(session?.user ?? null),
  );
}
