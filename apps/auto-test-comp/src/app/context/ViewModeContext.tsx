"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ViewMode = "simple" | "advanced";

const STORAGE_KEY = "learnify-view-mode";

type ViewModeContextValue = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdvanced: boolean;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("advanced");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === "simple" || stored === "advanced") {
      setViewModeState(stored);
    }
  }, [mounted]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, []);

  const value: ViewModeContextValue = {
    viewMode,
    setViewMode,
    isAdvanced: viewMode === "advanced",
  };

  return (
    <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within ViewModeProvider");
  }
  return ctx;
}
