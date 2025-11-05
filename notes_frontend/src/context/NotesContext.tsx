import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LocalStorageNotesService } from "../services/LocalStorageNotesService";
import { NotesService, Note, getApiBase } from "../services/NotesService";

type NotesContextType = {
  notes: Note[];
  activeId: string | null;
  loading: boolean;
  search: string;
  service: NotesService;
  setActiveId: (id: string | null) => void;
  setSearch: (s: string) => void;
  refresh: () => Promise<void>;
  createNote: () => Promise<void>;
  updateActive: (patch: Partial<Pick<Note, "title" | "body" | "tags">>) => Promise<void>;
  deleteActive: () => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

function getService(): NotesService {
  // Placeholder for future API service; for now always use LocalStorage
  const apiBase = getApiBase();
  if (apiBase) {
    // Future: implement ApiNotesService here. For now we still use local storage to satisfy requirements.
    return new LocalStorageNotesService();
  }
  return new LocalStorageNotesService();
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }: { children: React.ReactNode }) {
  const service = useMemo(() => getService(), []);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.list(search ? { search } : undefined);
      setNotes(list);
      if (list.length && !activeId) {
        setActiveId(list[0].id);
      }
      if (activeId && list.findIndex(n => n.id === activeId) === -1) {
        setActiveId(list[0]?.id ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [service, search, activeId]);

  useEffect(() => { refresh(); }, [refresh]);

  const createNote = useCallback(async () => {
    const created = await service.create({ title: "New note", body: "" });
    await refresh();
    setActiveId(created.id);
  }, [service, refresh]);

  const updateActive = useCallback(async (patch: Partial<Pick<Note, "title" | "body" | "tags">>) => {
    if (!activeId) return;
    const updated = await service.update(activeId, patch);
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  }, [service, activeId]);

  const deleteActive = useCallback(async () => {
    if (!activeId) return;
    await service.remove(activeId);
    await refresh();
  }, [service, activeId, refresh]);

  const value: NotesContextType = {
    notes,
    activeId,
    loading,
    search,
    service,
    setActiveId,
    setSearch,
    refresh,
    createNote,
    updateActive,
    deleteActive,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
