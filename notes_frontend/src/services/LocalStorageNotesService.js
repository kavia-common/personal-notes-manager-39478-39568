import { getApiBase, createNoteShape } from "./NotesService";

const STORAGE_KEY = "pnm.notes.v1";

function safeParse(raw, fallback) {
  try {
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    return Array.isArray(val) || typeof val === "object" ? val : fallback;
  } catch {
    return fallback;
  }
}

function save(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseFlags() {
  const raw = process.env.REACT_APP_FEATURE_FLAGS;
  if (!raw) return {};
  try {
    if (raw.trim().startsWith("{")) {
      return JSON.parse(raw);
    }
    const entries = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((k) => [k, true]);
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

// PUBLIC_INTERFACE
export class LocalStorageNotesService {
  getFeatureFlags() {
    return parseFlags();
  }

  async create(note) {
    const now = Date.now();
    const newNote = createNoteShape({
      id: uid(),
      title: (note.title || "Untitled").trim() || "Untitled",
      body: note.body || "",
      tags: note.tags || [],
      createdAt: now,
      updatedAt: now,
    });
    const notes = safeParse(localStorage.getItem(STORAGE_KEY), []);
    notes.unshift(newNote);
    save(notes);
    return newNote;
  }

  async update(id, patch) {
    const notes = safeParse(localStorage.getItem(STORAGE_KEY), []);
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    const updated = {
      ...notes[idx],
      ...patch,
      title: (patch.title ?? notes[idx].title).trim() || "Untitled",
      updatedAt: Date.now(),
    };
    notes[idx] = updated;
    save(notes);
    return updated;
  }

  async remove(id) {
    const notes = safeParse(localStorage.getItem(STORAGE_KEY), []);
    const filtered = notes.filter((n) => n.id !== id);
    save(filtered);
  }

  async get(id) {
    const notes = safeParse(localStorage.getItem(STORAGE_KEY), []);
    return notes.find((n) => n.id === id);
  }

  async list(query) {
    const notes = safeParse(localStorage.getItem(STORAGE_KEY), []);
    if (!query || !query.search) return notes;
    const s = query.search.toLowerCase();
    return notes.filter(
      (n) => (n.title || "").toLowerCase().includes(s) || (n.body || "").toLowerCase().includes(s)
    );
  }
}

// PUBLIC_INTERFACE
export function getNotesService() {
  const apiBase = getApiBase();
  // Placeholder for future API-based service selection
  void apiBase;
  return new LocalStorageNotesService();
}
