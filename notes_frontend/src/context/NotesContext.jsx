import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getNotesService } from "../services/LocalStorageNotesService";

const NotesContext = createContext(undefined);

// PUBLIC_INTERFACE
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

function getService() {
  return getNotesService();
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  const service = useMemo(() => getService(), []);
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await service.list(search ? { search } : undefined);
      setNotes(list);
      if (list.length && !activeId) {
        setActiveId(list[0].id);
      }
      if (activeId && list.findIndex((n) => n.id === activeId) === -1) {
        setActiveId(list[0]?.id ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [service, search, activeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNote = useCallback(async () => {
    const created = await service.create({ title: "New note", body: "" });
    await refresh();
    setActiveId(created.id);
  }, [service, refresh]);

  const updateActive = useCallback(
    async (patch) => {
      if (!activeId) return;
      const updated = await service.update(activeId, patch);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    },
    [service, activeId]
  );

  const deleteActive = useCallback(async () => {
    if (!activeId) return;
    await service.remove(activeId);
    await refresh();
  }, [service, activeId, refresh]);

  const value = {
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
