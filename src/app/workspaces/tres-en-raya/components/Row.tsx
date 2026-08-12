"use client";

import { Input } from "@/components/ui/input";

export interface RowData {
  id: string;
  question: string;
  answer: string;
}

interface RowProps {
  index: number;
  data: RowData;
  onChange: (updates: Partial<RowData>) => void;
}

export function Row({ index, data, onChange }: RowProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-brand/30">
      <div className="grid grid-cols-[2rem_1fr] items-start gap-2 w-full">
        <div className="flex h-8 w-full items-center justify-center rounded border border-border bg-muted/30 text-xs font-mono font-medium text-muted-foreground">
          {index + 1}
        </div>

        <Input
          value={data.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Pregunta..."
          className="h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />

        <Input
          value={data.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          placeholder="Respuesta..."
          className="col-start-2 h-8 w-full border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-brand"
        />
      </div>
    </div>
  );
}
