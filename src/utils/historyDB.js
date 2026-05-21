const DB_NAME = 'statify_history';
const STORE   = 'plays';
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'played_at' });
        store.createIndex('played_at', 'played_at', { unique: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

export async function mergeRecentPlays(items) {
  if (!items?.length) return;
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  for (const item of items) {
    try {
      store.put({
        played_at: item.played_at,
        track_id:  item.track?.id,
        track_name: item.track?.name,
      });
    } catch { /* duplicate — skip */ }
  }
  return new Promise((resolve) => { tx.oncomplete = resolve; });
}

export async function getAllPlays() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx    = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req   = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => resolve([]);
  });
}

export async function getPlayCount() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx  = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).count();
    req.onsuccess = () => resolve(req.result || 0);
    req.onerror   = () => resolve(0);
  });
}
