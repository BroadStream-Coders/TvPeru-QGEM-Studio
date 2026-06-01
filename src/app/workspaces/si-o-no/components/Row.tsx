"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface RowData {
  id: string;
  question: string;
  correctAnswer: "Si" | "No" | null;
}

interface RowProps {
  index: number;
  data: RowData;
  onChange: (updates: Partial<RowData>) => void;
  onRemove: () => void;
}

export function Row({ index, data, onChange, onRemove }: RowProps) {
  const toggleAnswer = (value: "Si" | "No") =>
    onChange({ correctAnswer: data.correctAnswer === value ? null : value });

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-brand/30">
      <div className="grid grid-cols-[2rem_1fr] items-start gap-2 w-full">
        {/* Left column top: Trash and Number */}
        <div className="flex flex-col gap-1 w-full shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-full rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <Trash2 className="size-4" />
          </Button>
          <div className="flex h-8 w-full items-center justify-center rounded border border-border bg-muted/30 text-xs font-mono font-medium text-muted-foreground">
            {index + 1}
          </div>
        </div>

        {/* Right column top: Textarea Question */}
        <Textarea
          value={data.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Ingrese la pregunta..."
          className="h-[68px] min-h-[68px] resize-none w-full border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        {/* Answer buttons: Sí / No on the same line */}
        <div className="col-span-2 flex gap-2">
          <button
            onClick={() => toggleAnswer("Si")}
            className={`flex h-8 flex-1 items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
              data.correctAnswer === "Si"
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            SÍ
          </button>

          <button
            onClick={() => toggleAnswer("No")}
            className={`flex h-8 flex-1 items-center justify-center rounded border text-xs font-bold font-mono transition-colors ${
              data.correctAnswer === "No"
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
