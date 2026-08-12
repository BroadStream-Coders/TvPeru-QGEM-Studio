import { create } from "zustand";
import React from "react";
import { ValidationIssue } from "@/helpers/validation";

interface WorkspaceHeaderState {
  title: string | null;
  icon: React.ReactNode | null;
  format?: "json" | "zip";
  onSave?: () => void;
  onLoad?: (file: File) => void;
  validate?: () => ValidationIssue[];
  setHeader: (
    header: Omit<WorkspaceHeaderState, "setHeader" | "resetHeader">,
  ) => void;
  resetHeader: () => void;
}

export const useWorkspaceHeader = create<WorkspaceHeaderState>((set) => ({
  title: null,
  icon: null,
  format: undefined,
  onSave: undefined,
  onLoad: undefined,
  validate: undefined,
  setHeader: (header) => set((state) => ({ ...state, ...header })),
  resetHeader: () =>
    set({
      title: null,
      icon: null,
      format: undefined,
      onSave: undefined,
      onLoad: undefined,
      validate: undefined,
    }),
}));
