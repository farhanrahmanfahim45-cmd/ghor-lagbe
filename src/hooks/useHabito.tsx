import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { db, DEMO_OWNER_ID } from "@/lib/db";
import { DEFAULT_REQUIREMENTS } from "@/lib/matching";
import type {
  DemoRole,
  Inquiry,
  SearchRequirements,
  SpaceListing,
  SpaceRequest,
} from "@/types/space";

const MAX_COMPARE = 4;

interface HabitoState {
  ready: boolean;
  listings: SpaceListing[];
  refresh: () => Promise<void>;

  role: DemoRole;
  setRole: (role: DemoRole) => void;
  ownerId: string;

  requirements: SearchRequirements;
  setRequirements: (r: SearchRequirements) => void;
  hasStatedNeeds: boolean;

  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => Promise<boolean>;

  compareIds: string[];
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;

  inquiries: Inquiry[];
  sendInquiry: (input: Omit<Inquiry, "id" | "sentAt" | "status">) => Promise<void>;

  requests: SpaceRequest[];
  addRequest: (input: Omit<SpaceRequest, "id" | "createdAt">) => Promise<void>;
}

const Ctx = createContext<HabitoState | null>(null);

export function HabitoProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [listings, setListings] = useState<SpaceListing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [requests, setRequests] = useState<SpaceRequest[]>([]);

  const [role, setRole] = useState<DemoRole>("seeker");
  const [requirements, setRequirementsState] = useState<SearchRequirements>(DEFAULT_REQUIREMENTS);
  const [hasStatedNeeds, setHasStated] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const [l, s, i, r] = await Promise.all([db.listings(), db.saved(), db.inquiries(), db.requests()]);
    setListings(l);
    setSavedIds(s);
    setInquiries(i);
    setRequests(r);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setRequirements = useCallback((r: SearchRequirements) => {
    setRequirementsState(r);
    setHasStated(true);
  }, []);

  const toggleSaved = useCallback(async (id: string) => {
    const nowSaved = await db.toggleSaved(id);
    setSavedIds(await db.saved());
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

  const sendInquiry = useCallback(
    async (input: Omit<Inquiry, "id" | "sentAt" | "status">) => {
      await db.createInquiry(input);
      await refresh();
    },
    [refresh],
  );

  const addRequest = useCallback(
    async (input: Omit<SpaceRequest, "id" | "createdAt">) => {
      await db.createRequest(input);
      setRequests(await db.requests());
    },
    [],
  );

  const value = useMemo<HabitoState>(
    () => ({
      ready,
      listings,
      refresh,
      role,
      setRole,
      ownerId: DEMO_OWNER_ID,
      requirements,
      setRequirements,
      hasStatedNeeds,
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved,
      compareIds,
      isComparing: (id) => compareIds.includes(id),
      toggleCompare,
      clearCompare: () => setCompareIds([]),
      inquiries,
      sendInquiry,
      requests,
      addRequest,
    }),
    [ready, listings, refresh, role, requirements, setRequirements, hasStatedNeeds, savedIds, toggleSaved, compareIds, toggleCompare, inquiries, sendInquiry, requests, addRequest],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHabito(): HabitoState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHabito must be used inside HabitoProvider");
  return ctx;
}

export { MAX_COMPARE };
