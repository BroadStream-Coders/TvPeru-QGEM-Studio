"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AuthButton } from "@/components/shared/AuthButton";
import { loadJsonFile, loadZipFile } from "@/helpers/persistence";
import { Button } from "@/components/ui/button";

const BUCKET = "data";

type Entry = { name: string; size?: number; updatedAt?: string };

function formatSize(bytes?: number) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DataCheck() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ name: string; text: string } | null>(
    null,
  );

  const list = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const all: Entry[] = [];
      for (const folder of ["oficial", "ejemplo"]) {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .list(folder, { sortBy: { column: "name", order: "asc" } });
        if (error) throw new Error(error.message);
        all.push(
          ...data
            .filter((f) => f.name !== ".emptyFolderPlaceholder")
            .map((f) => ({
              name: `${folder}/${f.name}`,
              size: f.metadata?.size,
              updatedAt: f.updated_at ?? undefined,
            })),
        );
      }
      setEntries(all);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    if (user) list();
  }, [user, list]);

  const open = async (name: string) => {
    setBusy(true);
    setError(null);
    setPreview(null);
    try {
      const { data, error } = await createClient()
        .storage.from(BUCKET)
        .download(name);
      if (error) throw error;
      const file = new File([data], name);
      if (name.toLowerCase().endsWith(".zip")) {
        const zip = await loadZipFile(file);
        const names = Object.keys(zip.files);
        const jsonName = names.find((n) => n.toLowerCase().endsWith(".json"));
        const json = jsonName
          ? JSON.stringify(
              JSON.parse(await zip.files[jsonName].async("string")),
              null,
              2,
            )
          : "(el ZIP no contiene JSON)";
        setPreview({
          name,
          text: `Contenido del ZIP:\n${names.map((n) => `  ${n}`).join("\n")}\n\n${jsonName ?? ""}\n${json}`,
        });
      } else {
        const parsed = await loadJsonFile<unknown>(file);
        setPreview({ name, text: JSON.stringify(parsed, null, 2) });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-background px-6 py-12 font-sans text-foreground">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Data check</h1>
          <AuthButton />
        </div>
        <p className="text-sm text-muted-foreground">
          Bucket privado{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-brand">
            {BUCKET}
          </code>{" "}
          — una sesión por juego. Requiere sesión de una cuenta con acceso de
          producción.
        </p>

        {!loading && !user && (
          <p className="text-sm text-yellow-500">
            Inicia sesión con Google para listar el bucket.
          </p>
        )}

        {user && (
          <Button variant="outline" size="sm" onClick={list} disabled={busy}>
            {busy ? "Cargando…" : "Recargar"}
          </Button>
        )}

        {error && (
          <pre className="whitespace-pre-wrap rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
            {"\n\n"}
            Si la lista sale vacía o denegada: revisa que tu email esté en la
            tabla production_access y que existan las policies del bucket.
          </pre>
        )}

        {user && entries && entries.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">
            El bucket está vacío (o tu cuenta no está en el allowlist: sin
            policy que aplique, listar devuelve vacío).
          </p>
        )}

        {entries && entries.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-3">
            <ul className="space-y-0.5">
              {entries.map((e) => (
                <li key={e.name}>
                  <button
                    onClick={() => open(e.name)}
                    className="flex w-full items-center gap-2 rounded px-1.5 py-0.5 text-left text-sm hover:bg-accent"
                  >
                    <span className="text-foreground">📄 {e.name}</span>
                    <span className="text-2xs text-muted-foreground">
                      {formatSize(e.size)}
                    </span>
                    {e.updatedAt && (
                      <span className="ml-auto text-2xs text-muted-foreground/60">
                        {new Date(e.updatedAt).toLocaleString()}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {preview && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-brand">{preview.name}</h2>
            <pre className="max-h-[50vh] overflow-auto rounded-lg border border-border bg-card p-3 text-xs text-foreground">
              {preview.text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
