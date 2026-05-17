import { BoardSize } from "../types";

interface BuscaLogoGridProps {
  logoPositions: number[];
  boardSize: BoardSize;
  onCellClick: (index: number) => void;
}

export function BuscaLogoGrid({
  logoPositions,
  boardSize,
  onCellClick,
}: BuscaLogoGridProps) {
  const [cols, rows] = boardSize.split("x").map(Number);
  const totalCells = cols * rows;
  const cells = Array.from({ length: totalCells }, (_, i) => i);

  // Determine grid classes dynamically based on cols
  const gridColsClass =
    cols === 4 ? "grid-cols-4" : cols === 5 ? "grid-cols-5" : "grid-cols-6";
  const aspectClass =
    cols === 4 ? "aspect-[4/3]" : cols === 5 ? "aspect-[5/4]" : "aspect-[6/5]";

  return (
    <section className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex-none bg-muted px-4 py-3 border-b border-border h-12 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Tablero</h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col items-center justify-center p-4 bg-background/50">
        <div
          className={`grid ${gridColsClass} gap-2 md:gap-3 lg:gap-4 p-4 lg:p-8 w-full max-w-4xl ${aspectClass}`}
        >
          {cells.map((index) => {
            const hasLogo = logoPositions.includes(index);
            return (
              <div
                key={index}
                onClick={() => onCellClick(index)}
                className={`
                  relative flex flex-col items-center justify-center aspect-square
                  rounded-xl border-2 transition-all cursor-pointer select-none
                  shadow-sm
                  ${
                    hasLogo
                      ? "bg-brand/10 border-brand/50 text-brand shadow-brand/20 shadow-md ring-2 ring-brand/20 scale-[0.98]"
                      : "bg-card border-border hover:border-brand/30 hover:bg-brand/5 text-muted-foreground hover:scale-[1.02]"
                  }
                `}
              >
                <div className="text-xs lg:text-sm font-medium opacity-50 absolute top-2 left-2">
                  {index + 1}
                </div>
                {hasLogo && (
                  <div className="text-2xl lg:text-4xl animate-in zoom-in duration-200">
                    ⭐
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
