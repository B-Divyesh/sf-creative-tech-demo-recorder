import type { DemoTake } from './types';

export type StorageMode = 'real' | 'demo';

const REAL_DB_NAME = 'demo-loop-local';
const DEMO_DB_NAME = 'demo:demo-loop-local';
const DB_VERSION = 1;
// Keep the original store name so existing local recordings remain readable.
const STORE = 'takes';

export function databaseName(mode: StorageMode): string {
  return mode === 'demo' ? DEMO_DB_NAME : REAL_DB_NAME;
}

function openDb(mode: StorageMode): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(mode), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function request<T>(mode: StorageMode, transactionMode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb(mode);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, transactionMode);
    const result = action(transaction.objectStore(STORE));
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function listTakes(mode: StorageMode): Promise<DemoTake[]> {
  const recordings = await request<DemoTake[]>(mode, 'readonly', (store) => store.getAll());
  return recordings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function putTake(mode: StorageMode, recording: DemoTake): Promise<IDBValidKey> {
  return request(mode, 'readwrite', (store) => store.put(recording));
}

export function removeTake(mode: StorageMode, id: string): Promise<undefined> {
  return request(mode, 'readwrite', (store) => store.delete(id));
}

export async function importTakes(mode: StorageMode, recordings: DemoTake[]): Promise<void> {
  const db = await openDb(mode);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);
    recordings.forEach((recording) => store.put(recording));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

export function clearDemoTakes(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DEMO_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close another Demo Loop tab, then reset the demo again.'));
  });
}
