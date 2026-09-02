const PREFIX = "nutrigest:cache:";

export function saveCache(key, data) {
  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify({
        data,
        savedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Impossible de sauvegarder le cache:", error);
  }
}

export function loadCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (error) {
    console.warn("Impossible de lire le cache:", error);
    return null;
  }
}

// Wipes every cached reference entry (families, stock, villages, etc.)
// on logout. Offline drafts (IndexedDB) are NOT touched here — those are
// the coordinator's actual unsynced work and must survive logout.
export function clearAllCache() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.warn("Impossible de vider le cache:", error);
  }
}
