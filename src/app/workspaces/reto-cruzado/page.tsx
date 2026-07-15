"use client";

import { useRef, useEffect, useCallback } from "react";
import { Layers, Shuffle } from "lucide-react";
import { saveAsJson, loadJsonFile } from "@/helpers/persistence";
import { jsonBlob } from "@/helpers/storage";
import { useWorkspaceHeader } from "@/hooks/use-workspace-header";
import { LevelTabs } from "@/components/shared/LevelTabs";
import { nanoid } from "nanoid";
import { SessionData } from "./types";
import { Level0View, Level0ViewRef } from "./components/Level0View";
import {
  Level1View,
  Level1ViewRef,
  Level1Column,
} from "./components/Level1View";
import {
  Level2View,
  Level2ViewRef,
  Level2Column,
} from "./components/Level2View";
import {
  Level3View,
  Level3ViewRef,
  Level3Column,
} from "./components/Level3View";
import {
  Level4View,
  Level4ViewRef,
  Level4Column,
} from "./components/Level4View";

const DEFAULT_FILENAME = "RetoCruzado.json";

export default function RetoCruzadoPage() {
  const level0Ref = useRef<Level0ViewRef>(null);
  const level1Ref = useRef<Level1ViewRef>(null);
  const level2Ref = useRef<Level2ViewRef>(null);
  const level3Ref = useRef<Level3ViewRef>(null);
  const level4Ref = useRef<Level4ViewRef>(null);

  const setHeader = useWorkspaceHeader((s) => s.setHeader);
  const resetHeader = useWorkspaceHeader((s) => s.resetHeader);

  const buildData = useCallback(() => {
    const data0 = level0Ref.current?.getData() || [];
    const data1 = level1Ref.current?.getData() || [];
    const data2 = level2Ref.current?.getData() || [];
    const data3 = level3Ref.current?.getData() || [];
    const data4 = level4Ref.current?.getData() || [];

    const exportData = {
      level0: { courses: data0 },
      level1: {
        groups: data1.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            question: q.question,
            options: [q.answerL, q.answerR],
            correctIndex: q.correctAnswer === "L" ? 0 : 1,
          })),
        })),
      },
      level2: {
        groups: data2.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            question: q.question,
            options: [q.answerA, q.answerB, q.answerC, q.answerD],
            correctIndex:
              q.correctAnswer === "A"
                ? 0
                : q.correctAnswer === "B"
                  ? 1
                  : q.correctAnswer === "C"
                    ? 2
                    : 3,
          })),
        })),
      },
      level3: {
        groups: data3.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            pairs: q.pairs.slice(0, 3).map((pair) => ({
              leftText: pair.leftText,
              rightText: pair.rightText,
            })),
          })),
        })),
      },
      level4: {
        groups: data4.map((col) => ({
          title: col.title,
          questions: col.rows.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        })),
      },
    };

    return exportData;
  }, []);

  const handleSave = useCallback(() => {
    try {
      saveAsJson(DEFAULT_FILENAME, buildData());
    } catch {
      alert("Error al exportar los datos.");
    }
  }, [buildData]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const sessionData = await loadJsonFile<SessionData>(file);
      if (!sessionData) {
        alert("El archivo no es un paquete JSON válido de Reto Cruzado.");
        return;
      }

      if (sessionData.level0?.courses) {
        level0Ref.current?.setData(sessionData.level0.courses);
      }

      if (sessionData.level1?.groups) {
        const d1: Level1Column[] = sessionData.level1.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answerL: q.options?.[0] || "",
            answerR: q.options?.[1] || "",
            correctAnswer: q.correctIndex === 0 ? "L" : "R",
          })),
        }));
        level1Ref.current?.setData(d1);
      }

      if (sessionData.level2?.groups) {
        const d2: Level2Column[] = sessionData.level2.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answerA: q.options?.[0] || "",
            answerB: q.options?.[1] || "",
            answerC: q.options?.[2] || "",
            answerD: q.options?.[3] || "",
            correctAnswer: (["A", "B", "C", "D"] as const)[q.correctIndex || 0],
          })),
        }));
        level2Ref.current?.setData(d2);
      }

      if (sessionData.level3?.groups) {
        const d3: Level3Column[] = sessionData.level3.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            pairs: Array.from({ length: 3 }, (_, idx) => ({
              leftText: q.pairs?.[idx]?.leftText || "",
              rightText: q.pairs?.[idx]?.rightText || "",
            })),
          })),
        }));
        level3Ref.current?.setData(d3);
      }

      if (sessionData.level4?.groups) {
        const d4: Level4Column[] = sessionData.level4.groups.map((g) => ({
          title: g.title || "",
          rows: g.questions.map((q) => ({
            id: nanoid(),
            question: q.question || "",
            answer: q.answer || "",
          })),
        }));
        level4Ref.current?.setData(d4);
      }
    } catch {
      alert("Error al importar los datos.");
    }
  }, []);

  useEffect(() => {
    return () => resetHeader();
  }, [resetHeader]);

  useEffect(() => {
    setHeader({
      title: "Reto Cruzado",
      icon: <Shuffle className="h-3 w-3" />,
      format: "json",
      onSave: handleSave,
      onLoad: handleLoad,
      upload: {
        filename: DEFAULT_FILENAME,
        getBlob: () => jsonBlob(buildData()),
      },
    });
  }, [setHeader, handleSave, handleLoad, buildData]);

  return (
    <main className="flex-1 overflow-hidden">
      <LevelTabs
        levels={[
          {
            name: "Nivel 0",
            icon: Layers,
            component: <Level0View ref={level0Ref} />,
          },
          {
            name: "Nivel 1",
            icon: Layers,
            component: <Level1View ref={level1Ref} />,
          },
          {
            name: "Nivel 2",
            icon: Layers,
            component: <Level2View ref={level2Ref} />,
          },
          {
            name: "Nivel 3",
            icon: Layers,
            component: <Level3View ref={level3Ref} />,
          },
          {
            name: "Nivel 4",
            icon: Layers,
            component: <Level4View ref={level4Ref} />,
          },
        ]}
      />
    </main>
  );
}
