const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`);
  if (res.status === 204) return null;
  return res.json();
}

// ── Collectes (récoltes journalières) ────────────────────────────────────────
export const collectes = {
  getAll: () =>
    request('/collectes'),

  upsert: (date, count) =>
    request('/collectes', {
      method: 'POST',
      body: JSON.stringify({ date, count }),
    }),

  remove: (date) =>
    request(`/collectes/${date}`, { method: 'DELETE' }),
};

// ── Catégories ───────────────────────────────────────────────────────────────
export const categories = {
  getAll: () =>
    request('/categories'),

  create: (name) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  remove: (id) =>
    request(`/categories/${id}`, { method: 'DELETE' }),
};

// ── Dépenses ─────────────────────────────────────────────────────────────────
export const depenses = {
  getAll: () =>
    request('/depenses'),

  create: (dto) =>
    request('/depenses', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id, dto) =>
    request(`/depenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  remove: (id) =>
    request(`/depenses/${id}`, { method: 'DELETE' }),
};

// ── Ventes ───────────────────────────────────────────────────────────────────
export const ventes = {
  getAll: () =>
    request('/ventes'),

  create: (dto) =>
    request('/ventes', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  update: (id, dto) =>
    request(`/ventes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),

  remove: (id) =>
    request(`/ventes/${id}`, { method: 'DELETE' }),
};
