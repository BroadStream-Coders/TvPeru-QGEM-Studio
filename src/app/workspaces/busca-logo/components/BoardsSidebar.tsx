import { Plus } from "lucide-react";
import { BoardData } from "../types";

interface BoardsSidebarProps {
  boards: BoardData[];
  selectedBoardId: string;
  maxBoards: number;
  onSelectBoard: (id: string) => void;
  onAddBoard: () => void;
}

export function BoardsSidebar({
  boards,
  selectedBoardId,
  maxBoards,
  onSelectBoard,
  onAddBoard,
}: BoardsSidebarProps) {
  return (
    <section className="w-full lg:w-[240px] shrink-0 flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <div className="flex-none bg-muted px-4 py-3 border-b border-border h-12 flex items-center justify-center">
        <h2 className="text-sm font-bold text-foreground">Estructura</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tableros */}
        <div className="w-full flex flex-col overflow-hidden bg-background">
          <div className="flex-none flex flex-col items-center bg-muted/50 p-2 border-b border-border text-center">
            <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">
              Tableros
            </span>
            <span className="text-2xs font-mono text-muted-foreground opacity-60 mt-0.5">
              {boards.length} / {maxBoards}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {boards.map((b, i) => {
              const isSelected = b.id === selectedBoardId;
              return (
                <button
                  key={b.id}
                  onClick={() => onSelectBoard(b.id)}
                  className={`w-full text-left px-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-brand/15 text-brand border border-brand/30 shadow-sm"
                      : "border border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Board {i + 1}
                </button>
              );
            })}
          </div>
          <div className="p-2 border-t border-border shrink-0 bg-card">
            <button
              onClick={onAddBoard}
              disabled={boards.length >= maxBoards}
              className="w-full flex items-center justify-center gap-1.5 rounded-md bg-brand/10 hover:bg-brand/20 text-brand py-2 text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" /> Añadir
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
