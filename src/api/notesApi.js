const API = 'https://api.restful-api.dev/objects';

export function apiGetAll() {
  return fetch(API).then((res) => {
    if (!res.ok) throw new Error(`GET failed (${res.status})`);
    return res.json();
  });
}

export async function apiGet(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error(`GET/${id} failed (${res.status})`);
  return res.json();
}

export async function apiCreate(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST failed (${res.status})`);
  return res.json();
}

export async function apiUpdate(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PUT failed (${res.status})`);
  return res.json();
}

export async function apiDelete(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE failed (${res.status})`);
  return true;
}

/** True only for objects shaped like a NoteVault note (has data.title/content).
 * Filters out dummy fixtures from the public demo API (phones, laptops, ...). */
export function isNoteObject(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const d = obj.data;
  if (!d || typeof d !== 'object') return false;
  return typeof d.title === 'string' || typeof d.content === 'string';
}

/** Normalize an API object into our note structure (null if not a real note) */
export function normalizeNote(obj) {
  if (!isNoteObject(obj)) return null;
  const d = obj.data || {};
  return {
    id: obj.id,
    title: d.title || obj.name || 'Untitled',
    content: d.content || '',
    category: d.category || 'personal',
    pinned: d.pinned === true,
    archived: d.archived === true,
    created: d.created || new Date().toISOString(),
    updated: d.updated || new Date().toISOString(),
  };
}
