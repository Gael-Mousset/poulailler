import { collectes as collectesApi } from '../services/api';

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function loadData() {
  try { return JSON.parse(localStorage.getItem('eggData') || '{}'); }
  catch { return {}; }
}

export async function syncFromServer() {
  try {
    return await collectesApi.getAll();
  } catch {
    return null;
  }
}

export const syncFromFile = syncFromServer;

export function saveData(d) {
  localStorage.setItem('eggData', JSON.stringify(d, null, 2));
}

export function saveCollecte(date, count) {
  if (count <= 0) {
    collectesApi.remove(date).catch(() => {});
  } else {
    collectesApi.upsert(date, count).catch(() => {});
  }
}
