"use client";

import { useEffect } from "react";
import { Box } from "lucide-react";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";

export default function SandboxPage() {
  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  useEffect(() => {
    setHeader({
      title: "Sandbox",
      icon: <Box className="h-3 w-3" />,
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="text-center space-y-4 max-w-md">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground">
          <Box className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Entorno de Pruebas
        </h1>
        <p className="text-sm text-muted-foreground">
          Este es un lienzo en blanco listo para prototipar nuevos componentes,
          lógicas y flujos de trabajo sin afectar el resto de la aplicación.
        </p>
      </div>
    </main>
  );
}
