import React from "react";
import "./styles/theme.css";
import { NotesProvider } from "./context/NotesContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";

/** 
 * PUBLIC_INTERFACE
 * App - Main application shell for Personal Notes.
 * Provides a responsive layout with header, sidebar, and editor pane.
 */
function App() {
  return (
    <NotesProvider>
      <div className="app-shell">
        <Header />
        <main className="layout" role="main">
          <Sidebar />
          <NoteEditor />
        </main>
      </div>
    </NotesProvider>
  );
}

export default App;
