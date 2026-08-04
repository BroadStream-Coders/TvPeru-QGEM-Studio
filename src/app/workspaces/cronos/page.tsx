"use client";

import { useState, useEffect, useCallback } from "react";
import { History } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { ValidationIssue, isBlank, formatPath } from "@/helpers/validation";
import { Column } from "./components/Column";
import { RowData } from "./components/Row";
import { nanoid } from "nanoid";

const DEFAULT_FILENAME = "Cronos.zip";

interface ExportItemData {
  date: string;
  title: string;
  imagePath: string;
}

interface ExportGroupData {
  title: string;
  items: ExportItemData[];
}

interface ExportData {
  groups: ExportGroupData[];
}

const COLUMN_SIZE = 5;

const createEmptyRow = (): RowData => ({ id: nanoid(), date: "", title: "" });
const createFullColumn = (): RowData[] =>
  Array.from({ length: COLUMN_SIZE }, createEmptyRow);

export default function CronosPage() {
  const [titles, setTitles] = useState<string[]>([""]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const {
    groups,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    replaceGroup,
    setGroups,
  } = useWorkspaceGroups<RowData>([createFullColumn()], createEmptyRow);

  const handleAddGroup = () => {
    setGroups((prev) => [...prev, createFullColumn()]);
    setTitles((prev) => [...prev, ""]);
  };

  // Carga rápida: pega 2 columnas de Excel (fecha, título) en las 5 filas fijas.
  // Solo llena las filas con datos (conserva imágenes), e ignora lo que pase de 5.
  const handleQuickLoad = (groupIndex: number, matrix: string[][]) => {
    const updated = groups[groupIndex].map((row, i) =>
      matrix[i]
        ? { ...row, date: matrix[i][0] || "", title: matrix[i][1] || "" }
        : row,
    );
    replaceGroup(groupIndex, updated);
  };

  const handleRemoveGroup = (idx: number) => {
    removeGroup(idx);
    setTitles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTitleChange = (idx: number, value: string) => {
    setTitles((prev) => prev.map((t, i) => (i === idx ? value : t)));
  };

  const handleSave = useCallback(async () => {
    const filesToInclude: { name: string; file: File }[] = [];

    const exportGroups = groups.map((items, groupIndex) => {
      const title = titles[groupIndex] || "";
      const exportItems = items.map((item, itemIndex) => {
        let imagePath = "";
        if (item.file) {
          const ext = item.file.name.split(".").pop();
          imagePath = `images/G${groupIndex + 1}_I${itemIndex + 1}.${ext}`;
          filesToInclude.push({ name: imagePath, file: item.file });
        }
        return {
          date: item.date.trim(),
          title: item.title.trim(),
          imagePath,
        };
      });
      return { title, items: exportItems };
    });

    const sessionData: ExportData = { groups: exportGroups };
    await saveAsZip(DEFAULT_FILENAME, sessionData, filesToInclude);
  }, [groups, titles]);

  const validate = useCallback((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    groups.forEach((items, groupIndex) => {
      const groupLabel = titles[groupIndex]?.trim() || `Grupo ${groupIndex + 1}`;
      if (isBlank(titles[groupIndex])) {
        issues.push({
          path: formatPath(`Grupo ${groupIndex + 1}`, "Pregunta / Título"),
          message: "Falta la pregunta / título del grupo.",
        });
      }
      items.forEach((item, itemIndex) => {
        const rowLabel = `Evento ${itemIndex + 1}`;
        if (isBlank(item.date)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Fecha"),
            message: "Falta la fecha.",
          });
        }
        if (isBlank(item.title)) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Título"),
            message: "Falta el título.",
          });
        }
        if (!item.file) {
          issues.push({
            path: formatPath(groupLabel, rowLabel, "Imagen"),
            message: "Falta la imagen.",
          });
        }
      });
    });
    return issues;
  }, [groups, titles]);

  const handleLoad = useCallback(
    async (file: File) => {
      try {
        const zip = await loadZipFile(file);
        const dataFile = zip.file("sessionData.json");
        if (!dataFile) {
          alert("El ZIP no contiene un archivo sessionData.json válido.");
          return;
        }

        const content = await dataFile.async("string");
        const sessionData = JSON.parse(content) as ExportData;

        if (Array.isArray(sessionData.groups)) {
          const loadedGroups = await Promise.all(
            sessionData.groups.map(async (g) => {
              const loadedItems = await Promise.all(
                g.items.map(async (item) => {
                  let imageFile = undefined;
                  let url = undefined;
                  if (item.imagePath) {
                    const entry = zip.file(item.imagePath);
                    if (entry) {
                      const blob = await entry.async("blob");
                      imageFile = new File(
                        [blob],
                        item.imagePath.split("/").pop() || "image",
                        { type: blob.type },
                      );
                      url = URL.createObjectURL(blob);
                    }
                  }
                  return {
                    id: nanoid(),
                    date: item.date || "",
                    title: item.title || "",
                    file: imageFile,
                    url,
                  };
                }),
              );
              return { title: g.title || "", items: loadedItems };
            }),
          );

          setTitles(loadedGroups.map((g) => g.title));
          setGroups(loadedGroups.map((g) => g.items));
        }
      } catch {
        alert("Error al procesar el archivo ZIP.");
      }
    },
    [setTitles, setGroups],
  );

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Cronos",
      icon: <History className="size-3" />,
      format: "zip",
      onSave: handleSave,
      onLoad: handleLoad,
      validate,
    });
  }, [setHeader, handleSave, handleLoad, validate]);

  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="w-full h-full">
        <div
          className="flex min-w-max"
          style={{ height: "calc(100vh - 48px - 36px)" }}
        >
          <GroupsContainer onAddGroup={handleAddGroup} addLabel="Agregar grupo">
            {groups.map((items, groupIndex) => (
              <Column
                key={groupIndex}
                index={groupIndex + 1}
                title={titles[groupIndex] || ""}
                onTitleChange={(val) => handleTitleChange(groupIndex, val)}
                items={items}
                onItemChange={(itemIdx, updates) =>
                  updateItem(groupIndex, itemIdx, {
                    ...items[itemIdx],
                    ...updates,
                  })
                }
                onAddItem={() => addItem(groupIndex)}
                onRemoveItem={(itemIdx) => removeItem(groupIndex, itemIdx)}
                onRemoveColumn={() => handleRemoveGroup(groupIndex)}
                onQuickLoad={(matrix) => handleQuickLoad(groupIndex, matrix)}
              />
            ))}
          </GroupsContainer>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  );
}
