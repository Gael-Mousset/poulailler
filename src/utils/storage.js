export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Chargement synchrone depuis localStorage (démarrage instantané)
export function loadData() {
  try { return JSON.parse(localStorage.getItem("eggData") || "{}"); }
  catch { return {}; }
}

// Lecture du fichier data.json au chargement de l'app
export async function syncFromFile() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Sauvegarde : localStorage + data.json en parallèle
export function saveData(d) {
  const json = JSON.stringify(d, null, 2);
  localStorage.setItem("eggData", json);
  fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  }).catch(() => {});
}
