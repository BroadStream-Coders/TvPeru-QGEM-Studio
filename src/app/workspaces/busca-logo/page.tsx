"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { nanoid } from "nanoid";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { jsonBlob } from "@/helpers/storage";
import { ValidationIssue, formatPath } from "@/helpers/validation";

import { BoardData, isValidBoardSize } from "./types";
import { BoardsSidebar } from "./components/BoardsSidebar";
import { BuscaLogoGrid } from "./components/BuscaLogoGrid";
import { BuscaLogoSidebar } from "./components/BuscaLogoSidebar";

const MAX_BOARDS = 12;
const DEFAULT_FILENAME = "BuscaLogo.json";

interface ExportedBoard {
  size: string;
  logoPositions: number[];
}

interface ExportedData {
  boards: ExportedBoard[];
}

const spawnBoard = (): BoardData => ({
  id: nanoid(),
  size: "5x4",
  logoPositions: [],
});

export default function BuscaLogoPage() {
  const [boards, setBoards] = useState<BoardData[]>([spawnBoard()]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0].id);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const currentBoardIndex = boards.findIndex((b) => b.id === selectedBoardId);
  const currentBoard =
    currentBoardIndex !== -1 ? boards[currentBoardIndex] : boards[0];

  const buildData = useCallback((): ExportedData => {
    const validBoards: ExportedBoard[] = [];
    for (const b of boards) {
      if (isValidBoardSize(b.size)) {
        validBoards.push({
          size: b.size,
          logoPositions: b.logoPositions.toSorted((a, b) => a - b),
        });
      }
    }
    return { boards: validBoards };
  }, [boards]);

  const handleSave = useCallback(() => {
    saveAsJson(DEFAULT_FILENAME, buildData());
  }, [buildData]);

  const validate = useCallback((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    boards.forEach((board, boardIndex) => {
      if (board.logoPositions.length === 0) {
        issues.push({
          path: formatPath(`Tablero ${boardIndex + 1}`),
          message: "El tablero no tiene ningún logo marcado.",
        });
      }
    });
    return issues;
  }, [boards]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const isValid = (data: unknown): data is ExportedData =>
        typeof data === "object" &&
        data !== null &&
        Array.isArray((data as ExportedData).boards);

      const data = await loadJsonFile<ExportedData>(file, isValid);

      if (data && data.boards) {
        const newBoards: BoardData[] = [];
        for (const b of data.boards) {
          if (isValidBoardSize(b.size)) {
            newBoards.push({
              id: nanoid(),
              size: b.size,
              logoPositions: b.logoPositions,
            });
          }
        }

        if (newBoards.length > 0) {
          setBoards(newBoards);
          setSelectedBoardId(newBoards[0].id);
        }
      }
    } catch {
      alert("Error al cargar archivo JSON de BuscaLogo.");
    }
  }, []);

  useEffect(() => {
    setHeader({
      title: "Busca Logo",
      icon: <Search className="size-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
      validate,
      upload: {
        filename: DEFAULT_FILENAME,
        getBlob: () => jsonBlob(buildData()),
      },
    });

    return () => resetHeader();
  }, [setHeader, resetHeader, handleSave, handleLoad, validate, buildData]);

  const handleAddBoard = () => {
    if (boards.length >= MAX_BOARDS) return;
    const newBoard = spawnBoard();
    setBoards((prev) => [...prev, newBoard]);
    setSelectedBoardId(newBoard.id);
  };

  const handleSelectBoard = (id: string) => {
    setSelectedBoardId(id);
  };

  const handleCellClick = (index: number) => {
    if (currentBoardIndex === -1) return;

    const newBoards = [...boards];
    const board = { ...newBoards[currentBoardIndex] };

    if (board.logoPositions.includes(index)) {
      board.logoPositions = board.logoPositions.filter((i) => i !== index);
    } else {
      board.logoPositions = [...board.logoPositions, index];
    }

    newBoards[currentBoardIndex] = board;
    setBoards(newBoards);
  };

  const handleSizeChange = (size: BoardData["size"]) => {
    if (currentBoardIndex === -1) return;

    const newBoards = [...boards];
    const board = { ...newBoards[currentBoardIndex] };

    const [cols, rows] = size.split("x").map(Number);
    const maxIndex = cols * rows;

    board.size = size;
    board.logoPositions = board.logoPositions.filter((i) => i < maxIndex);

    newBoards[currentBoardIndex] = board;
    setBoards(newBoards);
  };

  const handleRandomFill = (count: number) => {
    if (currentBoardIndex === -1) return;

    const newBoards = [...boards];
    const board = { ...newBoards[currentBoardIndex] };

    const [cols, rows] = board.size.split("x").map(Number);
    const maxIndex = cols * rows;

    const actualCount = Math.min(count, maxIndex);
    const allIndexes = Array.from({ length: maxIndex }, (_, i) => i);

    for (let i = allIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndexes[i], allIndexes[j]] = [allIndexes[j], allIndexes[i]];
    }

    board.logoPositions = allIndexes.slice(0, actualCount);

    newBoards[currentBoardIndex] = board;
    setBoards(newBoards);
  };

  if (!currentBoard) return null;

  return (
    <main className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:p-6 bg-background">
      <BoardsSidebar
        boards={boards}
        selectedBoardId={selectedBoardId}
        maxBoards={MAX_BOARDS}
        onSelectBoard={handleSelectBoard}
        onAddBoard={handleAddBoard}
      />

      {isValidBoardSize(currentBoard.size) ? (
        <BuscaLogoGrid
          logoPositions={currentBoard.logoPositions}
          boardSize={currentBoard.size}
          onCellClick={handleCellClick}
        />
      ) : (
        <section className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Tamaño de tablero no válido
        </section>
      )}

      <BuscaLogoSidebar
        boardSize={currentBoard.size}
        logoCount={currentBoard.logoPositions.length}
        onSizeChange={handleSizeChange}
        onRandomFill={handleRandomFill}
      />
    </main>
  );
}
