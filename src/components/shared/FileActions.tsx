"use client";

import { useRef, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDown,
  CloudDownload,
  CloudUpload,
  Download,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ValidationDialog } from "./ValidationDialog";
import { ValidationIssue } from "@/helpers/validation";
import {
  SessionUpload,
  UploadTarget,
  downloadSession,
  uploadSession,
} from "@/helpers/storage";
import { useAuth } from "@/hooks/use-auth";

interface FileActionsProps {
  format: "json" | "zip";
  onSave: () => void;
  onLoad: (file: File) => void;
  validate?: () => ValidationIssue[];
  upload?: SessionUpload;
  saveLabel?: string;
  loadLabel?: string;
}

type UploadStatus = {
  kind: "uploading" | "done" | "error";
  text: string;
};

type ConfirmState = {
  title: string;
  body: string;
  actionLabel: string;
  action: () => void;
};

export function FileActions({
  format,
  onSave,
  onLoad,
  validate,
  upload,
  saveLabel = "Guardar",
  loadLabel = "Cargar",
}: FileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingActionRef = useRef<() => void>(() => {});
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const { user } = useAuth();

  const showUpload = Boolean(upload && user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onLoad(file);
    e.target.value = "";
  };

  const runValidated = (action: () => void) => {
    const found = validate?.() ?? [];
    if (found.length > 0) {
      pendingActionRef.current = action;
      setIssues(found);
      return;
    }
    action();
  };

  const handleForce = () => {
    setIssues([]);
    pendingActionRef.current();
  };

  const doUpload = async (target: UploadTarget) => {
    if (!upload) return;
    setStatus({ kind: "uploading", text: `Subiendo (${target})…` });
    try {
      await uploadSession(target, upload.filename, await upload.getBlob());
      setStatus({ kind: "done", text: `✓ Subido (${target})` });
      setTimeout(() => setStatus(null), 4000);
    } catch (e) {
      setStatus({
        kind: "error",
        text: e instanceof Error ? e.message : "Error al subir",
      });
    }
  };

  const doDownload = async (target: UploadTarget) => {
    if (!upload) return;
    setStatus({ kind: "uploading", text: `Bajando (${target})…` });
    try {
      const file = await downloadSession(target, upload.filename);
      onLoad(file);
      setStatus({ kind: "done", text: `✓ Cargado (${target})` });
      setTimeout(() => setStatus(null), 4000);
    } catch (e) {
      setStatus({
        kind: "error",
        text: e instanceof Error ? e.message : "Error al bajar",
      });
    }
  };

  const statusColor = {
    uploading: "text-muted-foreground",
    done: "text-success",
    error: "text-destructive",
  };

  return (
    <>
      {status && (
        <span
          className={cn(
            "max-w-48 truncate text-2xs font-bold uppercase",
            statusColor[status.kind],
          )}
          title={status.text}
        >
          {status.text}
        </span>
      )}

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold uppercase",
            showUpload && "rounded-r-none",
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{loadLabel}</span>
        </Button>

        {showUpload && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={status?.kind === "uploading"}
                className="h-7 rounded-l-none border-l border-border px-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-2xl"
              >
                <DropdownMenu.Item
                  onSelect={() =>
                    setConfirm({
                      title: "Cargar oficial",
                      body: "Esto reemplaza lo que tienes en pantalla con la sesión oficial del storage. Lo no guardado se pierde.",
                      actionLabel: "Cargar",
                      action: () => doDownload("oficial"),
                    })
                  }
                  className="flex h-[30px] cursor-pointer items-center gap-2.5 rounded-md px-2 text-[12.5px] text-foreground outline-none data-[highlighted]:bg-accent"
                >
                  <CloudDownload className="h-3.5 w-3.5 text-brand" />
                  Cargar oficial
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() =>
                    setConfirm({
                      title: "Cargar ejemplo",
                      body: "Esto reemplaza lo que tienes en pantalla con la sesión de ejemplo del storage. Lo no guardado se pierde.",
                      actionLabel: "Cargar",
                      action: () => doDownload("ejemplo"),
                    })
                  }
                  className="flex h-[30px] cursor-pointer items-center gap-2.5 rounded-md px-2 text-[12.5px] text-muted-foreground outline-none data-[highlighted]:bg-accent"
                >
                  <CloudDownload className="h-3.5 w-3.5" />
                  Cargar ejemplo
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      <div className="flex items-center">
        <Button
          size="sm"
          onClick={() => runValidated(onSave)}
          className={cn(
            "h-7 gap-1.5 bg-brand hover:brightness-110 active:scale-[0.98] text-brand-foreground text-xs shadow-sm transition-all font-bold uppercase",
            showUpload && "rounded-r-none",
          )}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{saveLabel}</span>
        </Button>

        {showUpload && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                size="sm"
                disabled={status?.kind === "uploading"}
                className="h-7 rounded-l-none border-l border-brand-foreground/25 bg-brand px-1 text-brand-foreground shadow-sm transition-all hover:brightness-110"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 w-56 rounded-lg border border-border bg-popover p-1.5 shadow-2xl"
              >
                <DropdownMenu.Item
                  onSelect={() =>
                    setConfirm({
                      title: "Subir como oficial",
                      body: "Esto reemplaza la data oficial del storage — la que usará el programa. La subida anterior se pierde.",
                      actionLabel: "Subir",
                      action: () => runValidated(() => doUpload("oficial")),
                    })
                  }
                  className="flex h-[30px] cursor-pointer items-center gap-2.5 rounded-md px-2 text-[12.5px] text-foreground outline-none data-[highlighted]:bg-accent"
                >
                  <CloudUpload className="h-3.5 w-3.5 text-brand" />
                  Subir como oficial
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => runValidated(() => doUpload("ejemplo"))}
                  className="flex h-[30px] cursor-pointer items-center gap-2.5 rounded-md px-2 text-[12.5px] text-muted-foreground outline-none data-[highlighted]:bg-accent"
                >
                  <CloudUpload className="h-3.5 w-3.5" />
                  Subir como ejemplo
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={format === "json" ? ".json" : ".zip"}
        onChange={handleFileChange}
        className="hidden"
      />

      <ValidationDialog
        open={issues.length > 0}
        onClose={() => setIssues([])}
        onForceSave={handleForce}
        issues={issues}
      />

      <Dialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-brand" />
              {confirm?.title}
            </DialogTitle>
            <DialogDescription>{confirm?.body}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                confirm?.action();
                setConfirm(null);
              }}
            >
              {confirm?.actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
