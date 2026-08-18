"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid3x3 } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { ValidationIssue, isBlank, formatPath } from "@/helpers/validation";
import { nanoid } from "nanoid";
import { Column } from "./components/Column";
import { RowData } from "./components/Row";

const DEFAULT_FILENAME = "TresEnRaya.json";
const BOARD_SIZE = 9;

// ── Tipos del JSON de exportación ──

interface SlotExport {
  question: string;
  answer: string;
}

interface GroupExport {
  slots: SlotExport[];
}

interface SessionData {
  groups: GroupExport[];
}

// ── Helpers ──

const createEmptyRow = (): RowData => ({
  id: nanoid(),
  question: "",
  answer: "",
});

const toBoard = (rows: RowData[]): RowData[] =>
  Array.from({ length: BOARD_SIZE }, (_, i) => rows[i] ?? createEmptyRow());

const createEmptyColumn = (): RowData[] => toBoard([]);

export default function TresEnRayaPage() {
  const [columns, setColumns] = useState<RowData[][]>([createEmptyColumn()]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  // ── Column handlers ──

  const addColumn = () => setColumns((prev) => [...prev, createEmptyColumn()]);

  const removeColumn = (index: number) =>
    setColumns((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (
    colIndex: number,
    rowIndex: number,
    updates: Partial<RowData>,
  ) =>
    setColumns((prev) =>
      prev.map((rows, i) =>
        i === colIndex
          ? rows.map((r, j) => (j === rowIndex ? { ...r, ...updates } : r))
          : rows,
      ),
    );

  // ── Quick Load ──

  // Pega 2 columnas de Excel (pregunta, respuesta) en las 9 casillas fijas.
  // Solo llena las filas con datos e ignora lo que pase de 9.
  const handleQuickLoad = useCallback(
    (colIndex: number, matrix: string[][]) =>
      setColumns((prev) =>
        prev.map((rows, i) =>
          i === colIndex
            ? rows.map((row, j) =>
                matrix[j]
                  ? {
                      ...row,
                      question: matrix[j][0] || "",
                      answer: matrix[j][1] || "",
                    }
                  : row,
              )
            : rows,
        ),
      ),
    [],
  );

  // ── Save / Load ──

  const buildData = useCallback(
    (): SessionData => ({
      groups: columns.map((rows) => ({
        slots: rows.map((r) => ({
          question: r.question.trim(),
          answer: r.answer.trim(),
        })),
      })),
    }),
    [columns],
  );

  const handleSave = useCallback(() => {
    saveAsJson(DEFAULT_FILENAME, buildData());
  }, [buildData]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const isValid = (data: unknown): data is SessionData =>
        typeof data === "object" &&
        data !== null &&
        "groups" in data &&
        Array.isArray((data as SessionData).groups);

      const data = await loadJsonFile<SessionData>(file, isValid);
      if (data?.groups) {
        const loaded = data.groups.map((g) =>
          toBoard(
            (g.slots || []).map((q) => ({
              id: nanoid(),
              question: q.question || "",
              answer: q.answer || "",
            })),
          ),
        );
        setColumns(loaded.length > 0 ? loaded : [createEmptyColumn()]);
      }
    } catch {
      alert("Error al cargar el archivo JSON.");
    }
  }, []);

  // ── Validation ──

  const validate = useCallback((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    columns.forEach((rows, colIndex) => {
      const groupLabel = `Ronda ${colIndex + 1}`;
      rows.forEach((row, rowIndex) => {
        const rowLabel = `Casilla ${rowIndex + 1}`;
        if (isBlank(row.question)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Enunciado"),
            message: "Falta el enunciado.",
          });
        }
        if (isBlank(row.answer)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Respuesta"),
            message: "Falta la respuesta.",
          });
        }
      });
    });
    return issues;
  }, [columns]);

  // ── Header ──

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Tres en Raya",
      icon: <Grid3x3 className="size-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
      validate,
    });
  }, [setHeader, handleSave, handleLoad, validate]);

  // ── Render ──

  return (
    <main className="flex-1 overflow-hidden">
      <GroupsContainer onAddGroup={addColumn} addLabel="Agregar Ronda">
        {columns.map((rows, colIndex) => (
          <Column
            key={colIndex}
            index={colIndex + 1}
            rows={rows}
            onRemoveColumn={() => removeColumn(colIndex)}
            onUpdateRow={(rowIdx, updates) =>
              updateRow(colIndex, rowIdx, updates)
            }
            onQuickLoad={(matrix) => handleQuickLoad(colIndex, matrix)}
          />
        ))}
      </GroupsContainer>
    </main>
  );
}
