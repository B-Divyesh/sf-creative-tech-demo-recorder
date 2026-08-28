import type { DemoTake } from './types';

const DB_NAME = 'demo-loop-local';
const DB_VERSION = 1;
const STORE = 'takes';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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

async function request<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const result = action(transaction.objectStore(STORE));
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function listTakes(): Promise<DemoTake[]> {
  const takes = await request<DemoTake[]>('readonly', (store) => store.getAll());
  return takes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function putTake(take: DemoTake): Promise<IDBValidKey> {
  return request('readwrite', (store) => store.put(take));
}

export function removeTake(id: string): Promise<undefined> {
  return request('readwrite', (store) => store.delete(id));
}

export async function importTakes(takes: DemoTake[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);
    takes.forEach((take) => store.put(take));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}
