import { openDB } from "idb";

const DB_NAME = "nutrigest-offline";
const STORE = "drafts";

function notifyDraftsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nutrigest:drafts-changed"));
  }
}

function dbPromise() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE, { keyPath: "clientId" });
      store.createIndex("type", "type");
      store.createIndex("createdAt", "createdAt");
    },
  });
}

function makeClientId() {
  // Stable id kept on the draft AND sent to the backend, so a retried
  // or double-tapped submit is deduplicated server-side.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// type: 'famille' | 'visite' | 'distribution' | 'aide_zakat'
// payload: plain JSON-able fields for that record
// files: optional { fieldName: File } map (e.g. { photo: fileObj })
export async function saveDraft(type, payload, files = {}) {
  const db = await dbPromise();
  const draft = {
    clientId: makeClientId(),
    type,
    payload,
    files, // File/Blob objects are structured-clone-able, IndexedDB stores them directly
    status: "pending", // 'pending' | 'sending' | 'error'
    error: null,
    createdAt: Date.now(),
  };
  await db.put(STORE, draft);
  notifyDraftsChanged();
  return draft;
}

export async function listDrafts() {
  const db = await dbPromise();
  const all = await db.getAll(STORE);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function countDrafts() {
  const db = await dbPromise();
  return db.count(STORE);
}

export async function deleteDraft(clientId) {
  const db = await dbPromise();
  await db.delete(STORE, clientId);
  notifyDraftsChanged();
}

export async function markDraftStatus(clientId, status, error = null) {
  const db = await dbPromise();
  const draft = await db.get(STORE, clientId);
  if (!draft) return;
  draft.status = status;
  draft.error = error;
  await db.put(STORE, draft);
  notifyDraftsChanged();
}