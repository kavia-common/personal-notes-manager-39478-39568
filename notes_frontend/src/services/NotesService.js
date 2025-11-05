 // PUBLIC_INTERFACE
export function getApiBase() {
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (base && base.trim().length > 0) return base.trim().replace(/\/+$/, "");
  return undefined;
}

// PUBLIC_INTERFACE
export function createNoteShape(overrides = {}) {
  const now = Date.now();
  return {
    id: "",
    title: "Untitled",
    body: "",
    createdAt: now,
    updatedAt: now,
    tags: [],
    ...overrides,
  };
}
