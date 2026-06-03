"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { ValidationIssue, isBlank, formatPath } from "@/helpers/validation";
import { Column } from "./components/Column";
import { Players } from "./components/Players";

const DEFAULT_FILENAME = "MiLibroFavorito.json";

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface LibroGroup {
  slots: QuestionAnswer[];
}

interface PlayerData {
  name: string;
}

interface SessionData {
  players: {
    playerName: string;
    maxHealth: number;
  }[];
  groups: LibroGroup[];
}

const createEmptyQA = (): QuestionAnswer => ({ question: "", answer: "" });

const initialGroups: QuestionAnswer[][] = [
  [createEmptyQA(), createEmptyQA()],
  [createEmptyQA(), createEmptyQA()],
];

export default function MiLibroFavoritoPage() {
  const [players, setPlayers] = useState<PlayerData[]>([
    { name: "" },
    { name: "" },
  ]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<QuestionAnswer>(initialGroups, createEmptyQA);

  const handlePlayerNameChange = (index: number, name: string) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name } : p)),
    );
  };

  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    replaceGroup(
      groupIndex,
      matrix.map((row) => ({ question: row[0] || "", answer: row[1] || "" })),
    );
  };

  const handleSave = useCallback(async () => {
    const playersMetadata = players.map((p) => ({
      playerName: p.name,
      maxHealth: 3,
    }));

    const sessionData: SessionData = {
      players: playersMetadata,
      groups: groups.map((slots) => ({ slots })),
    };

    await saveAsJson(DEFAULT_FILENAME, sessionData);
  }, [players, groups]);

  const validate = useCallback((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    players.forEach((player, playerIndex) => {
      if (isBlank(player.name)) {
        issues.push({
          path: formatPath(`Jugador ${playerIndex + 1}`, "Nombre"),
          message: "Falta el nombre del jugador.",
        });
      }
    });

    groups.forEach((slots, groupIndex) => {
      const groupLabel = `Ronda ${groupIndex + 1}`;
      slots.forEach((slot, slotIndex) => {
        const rowLabel = `Fila ${slotIndex + 1}`;
        if (isBlank(slot.question)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Enunciado"),
            message: "Falta el enunciado.",
          });
        }
        if (isBlank(slot.answer)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Respuesta"),
            message: "Falta la respuesta.",
          });
        }
      });
    });

    return issues;
  }, [players, groups]);

  const handleLoad = useCallback(
    async (file: File) => {
      try {
        const sessionData = await loadJsonFile<SessionData>(file);
        if (!sessionData) return;

        if (Array.isArray(sessionData.players)) {
          setPlayers(
            sessionData.players.map((p) => ({ name: p.playerName || "" })),
          );
        }

        if (Array.isArray(sessionData.groups)) {
          setGroups(sessionData.groups.map((g) => g.slots));
        }
      } catch {
        alert("Error al procesar el archivo JSON.");
      }
    },
    [setPlayers, setGroups],
  );

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Mi Libro Favorito",
      icon: <BookOpen className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
      validate,
    });
  }, [setHeader, handleSave, handleLoad, validate]);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Player info column — se mantiene fuera del sistema de grupos */}
        <div className="shrink-0 overflow-y-auto py-6 px-6">
          <Players
            players={players}
            onPlayerNameChange={handlePlayerNameChange}
          />
        </div>

        <div className="w-px bg-border/50 shrink-0 my-6" />

        {/* Columnas de rondas */}
        <div className="flex-1 min-w-0">
          <GroupsContainer onAddGroup={addGroup} addLabel="Agregar ronda">
            {groups.map((slots, groupIndex) => (
              <Column
                key={groupIndex}
                index={groupIndex + 1}
                items={slots}
                onItemChange={(itemIdx, field, val) =>
                  updateItem(groupIndex, itemIdx, {
                    ...slots[itemIdx],
                    [field]: val,
                  })
                }
                onAddItem={() => addItem(groupIndex)}
                onRemoveItem={(itemIdx) => removeItem(groupIndex, itemIdx)}
                onRemoveColumn={() => removeGroup(groupIndex)}
                onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
              />
            ))}
          </GroupsContainer>
        </div>
      </div>
    </main>
  );
}
