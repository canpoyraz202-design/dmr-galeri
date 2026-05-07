// IndexedDB helper for persistent photo storage
const DB_NAME = 'halil01dmr_gallery';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

export interface StoredPhoto {
  id: string;
  data: string; // base64 data URL
  title: string;
  category: 'dogal' | 'sehir' | 'portre' | 'diger';
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addPhoto(photo: Omit<StoredPhoto, 'id' | 'createdAt'>): Promise<StoredPhoto> {
  const db = await openDB();
  const newPhoto: StoredPhoto = {
    ...photo,
    id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(newPhoto);
    request.onsuccess = () => resolve(newPhoto);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const photos = request.result as StoredPhoto[];
      photos.sort((a, b) => b.createdAt - a.createdAt);
      resolve(photos);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updatePhoto(id: string, updates: Partial<Pick<StoredPhoto, 'title' | 'category'>>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const photo = getReq.result;
      if (!photo) return reject(new Error('Photo not found'));
      const updated = { ...photo, ...updates };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// Convert File to base64 data URL
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
