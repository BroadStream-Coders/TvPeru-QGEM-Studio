"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Status = "checking" | "ok" | "error";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<Status>("checking");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    async function check() {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.getSession();
        if (error) {
          setStatus("error");
          setDetail(error.message);
        } else {
          setStatus("ok");
          setDetail("Conexión establecida correctamente.");
        }
      } catch (e) {
        setStatus("error");
        setDetail(e instanceof Error ? e.message : "Error desconocido");
      }
    }
    check();
  }, []);

  const colors: Record<Status, string> = {
    checking: "text-yellow-500",
    ok: "text-green-500",
    error: "text-red-500",
  };

  const labels: Record<Status, string> = {
    checking: "Verificando...",
    ok: "Supabase OK",
    error: "Error de conexión",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-mono">
      <div className="space-y-2 text-center">
        <p className={`text-2xl font-bold ${colors[status]}`}>
          {labels[status]}
        </p>
        <p className="text-sm text-muted-foreground">{detail}</p>
        <p className="text-xs text-muted-foreground/50">
          {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
      </div>
    </div>
  );
}
