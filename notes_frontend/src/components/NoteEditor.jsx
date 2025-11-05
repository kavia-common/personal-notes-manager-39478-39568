import React, { useMemo } from "react";
import "../styles/theme.css";
import { useNotes } from "../context/NotesContext";

// PUBLIC_INTERFACE
export default function NoteEditor() {
  const { notes, activeId, updateActive } = useNotes();

  const note = useMemo(() => notes.find((n) => n.id === activeId), [notes, activeId]);

  if (!note) {
    return (
      <div className="editor">
        <div className="empty-state">Select a note from the sidebar or create a new one.</div>
      </div>
    );
  }

  return (
    <section className="editor" aria-label="Note editor">
      <div className="editor-header">
        <input
          className="input-title"
          value={note.title}
          onChange={(e) => updateActive({ title: e.target.value })}
          placeholder="Note title"
          aria-label="Note title"
        />
      </div>
      <textarea
        className="textarea-body"
        value={note.body}
        onChange={(e) => updateActive({ body: e.target.value })}
        placeholder="Write your note here..."
        aria-label="Note body"
      />
    </section>
  );
}
