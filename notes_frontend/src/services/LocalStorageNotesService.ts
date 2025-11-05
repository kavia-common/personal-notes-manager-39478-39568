import { NotesService, Note, FeatureFlags } from "./NotesService";

const STORAGE_KEY = "pnm.notes.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    const val = JSON.parse(raw);
    return Array.isArray(val) || typeof val === "object" ? (val as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseFlags(): FeatureFlags {
  const raw = process.env.REACT_APP_FEATURE_FLAGS;
  if (!raw) return {};
  try {
    // Accept JSON or comma-separated flags "flagA,flagB"
    if (raw.trim().startsWith("{")) {
      return JSON.parse(raw);
    }
    const entries = raw
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(k => [k, true]);
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

export class LocalStorageNotesService implements NotesService {
  getFeatureFlags(): FeatureFlags {
    return parseFlags();
  }

  async create(note: Pick<Note, "title" | "body" | "tags">): Promise<Note> {
    const now = Date.now();
    const newNote: Note = {
      id: uid(),
      title: note.title?.trim() || "Untitled",
      body: note.body || "",
      tags: note.tags || [],
      createdAt: now,
      updatedAt: now,
    };
    const notes = safeParse<Note[]>(localStorage.getItem(STORAGE_KEY), []);
    notes.unshift(newNote);
    save(notes);
    return newNote;
  }

  async update(id: string, patch: Partial<Pick<Note, "title" | "body" | "tags">>): Promise<Note> {
    const notes = safeParse<Note[]>(localStorage.getItem(STORAGE_KEY), []);
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    const updated: Note = {
      ...notes[idx],
      ...patch,
      title: (patch.title ?? notes[idx].title).trim() || "Untitled",
      updatedAt: Date.now(),
    };
    notes[idx] = updated;
    save(notes);
    return updated;
    }

  async remove(id: string): Promise<void> {
    const notes = safeParse<Note[]>(localStorage.getItem(STORAGE_KEY), []);
    const filtered = notes.filter(n => n.id !== id);
    save(filtered);
  }

  async get(id: string): Promise<Note | undefined> {
    const notes = safeParse<Note[]>(localStorage.getItem(STORAGE_KEY), []);
    return notes.find(n => n.id === id);
  }

  async list(query?: { search?: string }): Promise<Note[]> {
    const notes = safeParse<Note[]>(localStorage.getItem(STORAGE_KEY), []);
    if (!query?.search) return notes;
    const s = query.search.toLowerCase();
    return notes.filter(n => n.title.toLowerCase().includes(s) || n.body.toLowerCase().includes(s));
  }
}
