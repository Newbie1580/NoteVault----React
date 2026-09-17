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

/** Normalize an API object into our note structure */
export function normalizeNote(obj) {
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
