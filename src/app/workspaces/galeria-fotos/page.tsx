"use client";

import { useState, useEffect, useCallback } from "react";
import { Images } from "lucide-react";
import { saveAsZip, loadZipFile } from "@/helpers/persistence";
import { GroupsContainer } from "@/components/shared/group-column/layout/GroupsContainer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { useWorkspaceGroups } from "@/hooks/use-workspace-groups";
import { ValidationIssue, formatPath } from "@/helpers/validation";
import { Column } from "./components/Column";
import { RowData } from "./components/Row";
import { nanoid } from "nanoid";

const DEFAULT_FILENAME = "GaleriaFotos.zip";

interface ExportGroupData {
  title: string;
  items: { imagePath: string }[];
}

interface ExportData {
  groups: ExportGroupData[];
}

const createEmptyRow = (): RowData => ({ id: nanoid() });

export default function GaleriaFotosPage() {
  const [titles, setTitles] = useState<string[]>([""]);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const {
    groups,
    addGroup,
    removeGroup,
    addItem,
    removeItem,
    updateItem,
    setGroups,
  } = useWorkspaceGroups<RowData>([[createEmptyRow()]], createEmptyRow);

  const handleAddGroup = () => {
    addGroup();
    setTitles((prev) => [...prev, ""]);
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
        if (item.file) {
          const ext = item.file.name.split(".").pop();
          const fileName = `images/G${groupIndex + 1}_I${itemIndex + 1}.${ext}`;
          filesToInclude.push({ name: fileName, file: item.file });
          return { imagePath: fileName };
        }
        return { imagePath: "" };
      });
      return { title, items: exportItems };
    });

    const sessionData: ExportData = { groups: exportGroups };
    await saveAsZip(DEFAULT_FILENAME, sessionData, filesToInclude);
  }, [groups, titles]);

  const validate = useCallback((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    groups.forEach((items, groupIndex) => {
      const groupLabel = `Grupo ${groupIndex + 1}`;
      items.forEach((item, itemIndex) => {
        if (!item.file) {
          issues.push({
            path: formatPath(groupLabel, `Foto ${itemIndex + 1}`),
            message: "Falta la imagen.",
          });
        }
      });
    });
    return issues;
  }, [groups]);

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
                  return { id: nanoid(), file: imageFile, url };
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
      title: "Galería de Fotos",
      icon: <Images className="h-3 w-3" />,
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
              />
            ))}
          </GroupsContainer>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </main>
  );
}
