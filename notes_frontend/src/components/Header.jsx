import React from "react";
import "../styles/theme.css";
import { useNotes } from "../context/NotesContext";

// PUBLIC_INTERFACE
export default function Header() {
  const { createNote } = useNotes();

  return (
    <header className="header" role="banner" aria-label="Application header">
      <div className="brand" aria-label="Brand">
        <div className="logo" aria-hidden="true" />
        <div>
          <div style={{ fontSize: 16 }}>Personal Notes</div>
          <div className="badge" style={{ marginTop: 2 }}>
            <span role="img" aria-label="sparkles">✨</span> Ocean Professional
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="btn" onClick={() => window.location.reload()}>
          Refresh
        </button>
        <button className="btn btn-primary" onClick={createNote}>
          + New Note
        </button>
      </div>
    </header>
  );
}
