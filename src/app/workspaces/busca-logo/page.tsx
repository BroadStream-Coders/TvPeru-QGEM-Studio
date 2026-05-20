"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { nanoid } from "nanoid";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";

import { BoardData } from "./types";
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

  const handleSave = useCallback(() => {
    const payload = {
      boards: boards.map((b) => ({
        size: b.size,
        logoPositions: [...b.logoPositions].sort((a, b) => a - b),
      })),
    };
    saveAsJson(DEFAULT_FILENAME, payload);
  }, [boards]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const isValid = (data: unknown): data is ExportedData =>
        typeof data === "object" &&
        data !== null &&
        Array.isArray((data as ExportedData).boards);

      const data = await loadJsonFile<ExportedData>(file, isValid);

      if (data && data.boards) {
        const newBoards = data.boards.map((b) => ({
          id: nanoid(),
          size: (b.size as BoardData["size"]) || "5x4",
          logoPositions: b.logoPositions,
        }));

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
      icon: <Search className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
    });

    return () => resetHeader();
  }, [setHeader, resetHeader, handleSave, handleLoad]);

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

    // Si el tablero se achica, filtramos los índices que quedan fuera de los límites
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

    // Shuffle and pick
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

      <BuscaLogoGrid
        logoPositions={currentBoard.logoPositions}
        boardSize={currentBoard.size}
        onCellClick={handleCellClick}
      />

      <BuscaLogoSidebar
        boardSize={currentBoard.size}
        logoCount={currentBoard.logoPositions.length}
        onSizeChange={handleSizeChange}
        onRandomFill={handleRandomFill}
      />
    </main>
  );
}
