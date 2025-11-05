export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
};

export type FeatureFlags = {
  [key: string]: boolean;
};

// PUBLIC_INTERFACE
export interface NotesService {
  /** Create a new note */
  create(note: Pick<Note, "title" | "body" | "tags">): Promise<Note>;
  /** Update an existing note by id */
  update(id: string, patch: Partial<Pick<Note, "title" | "body" | "tags">>): Promise<Note>;
  /** Delete note by id */
  remove(id: string): Promise<void>;
  /** Get one note by id */
  get(id: string): Promise<Note | undefined>;
  /** List notes, optionally filtered by search text */
  list(query?: { search?: string }): Promise<Note[]>;
  /** Load feature flags (optional) */
  getFeatureFlags(): FeatureFlags;
}

// PUBLIC_INTERFACE
export function getApiBase(): string | undefined {
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (base && base.trim().length > 0) return base.trim().replace(/\/+$/, "");
  return undefined;
}
