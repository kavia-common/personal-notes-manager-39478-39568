import React from "react";
import "../styles/theme.css";
import { useNotes } from "../context/NotesContext";

function snippet(text: string, n = 80) {
  const s = text.replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// PUBLIC_INTERFACE
export default function NotesList() {
  const { notes, activeId, setActiveId, deleteActive } = useNotes();

  if (!notes.length) {
    return <div className="empty-state">No notes yet. Create your first note.</div>;
  }

  return (
    <>
      {notes.map((n) => (
        <div
          key={n.id}
          className={`note-item ${activeId === n.id ? "active" : ""}`}
          onClick={() => setActiveId(n.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setActiveId(n.id)}
          aria-pressed={activeId === n.id}
          aria-label={`Open note ${n.title || "Untitled"}`}
        >
          <div className="note-meta" style={{ width: "100%" }}>
            <div className="note-title">
              {n.title || "Untitled"}
            </div>
            <div className="note-snippet">
              {snippet(n.body || "")}
            </div>
          </div>
          {activeId === n.id && (
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteActive();
              }}
              aria-label="Delete note"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </>
  );
}
