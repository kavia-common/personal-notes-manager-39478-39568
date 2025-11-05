import React, { useEffect } from "react";
import "../styles/theme.css";
import { useNotes } from "../context/NotesContext";
import NotesList from "./NotesList";

// PUBLIC_INTERFACE
export default function Sidebar() {
  const { search, setSearch, refresh } = useNotes();

  useEffect(() => {
    const t = setTimeout(() => refresh(), 180);
    return () => clearTimeout(t);
  }, [search, refresh]);

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="section-title">Browse</div>
      <div className="search" role="search">
        <span className="icon" aria-hidden="true">🔎</span>
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="section-title">Notes</div>
      <div className="notes-list" role="navigation" aria-label="Notes list">
        <NotesList />
      </div>
    </aside>
  );
}
