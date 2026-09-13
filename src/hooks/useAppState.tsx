import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DemoRole } from "@/types/property";

/**
 * Deliberately plain React state — no store library.
 * Nothing here persists, which keeps the prototype honest about being a prototype.
 */
interface AppState {
  role: DemoRole;
  setRole: (role: DemoRole) => void;

  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean;

  compareIds: string[];
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const MAX_COMPARE = 3;

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole>("renter");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleSaved = useCallback((id: string) => {
    let nowSaved = false;
    setSavedIds((prev) => {
      nowSaved = !prev.includes(id);
      return nowSaved ? [...prev, id] : prev.filter((x) => x !== id);
    });
    return nowSaved;
  }, []);

  const toggleCompare = useCallback((id: string) => {
    let added = false;
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      added = true;
      return [...prev, id];
    });
    return added;
  }, []);

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
      compareIds,
      isComparing: (id) => compareIds.includes(id),
      toggleCompare,
      clearCompare: () => setCompareIds([]),
    }),
    [role, savedIds, compareIds, toggleSaved, toggleCompare],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export { MAX_COMPARE };
