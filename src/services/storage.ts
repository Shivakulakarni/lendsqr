import { User } from '../types';

const DB_NAME = 'LendsqrDB';
const STORE_NAME = 'users';
const DB_VERSION = 1;

let db: IDBDatabase;

export const storageService = {
  init: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject('Failed to open IndexedDB');
      };

      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const targetDb = (event.target as IDBOpenDBRequest).result;
        if (!targetDb.objectStoreNames.contains(STORE_NAME)) {
          targetDb.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  },

  saveUser: async (user: User): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(user);

      request.onerror = () => {
        reject('Failed to save user');
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  },

  getUser: async (userId: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(userId);

      request.onerror = () => {
        reject('Failed to get user');
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        reject('Failed to get all users');
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  },

  deleteUser: async (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(userId);

      request.onerror = () => {
        reject('Failed to delete user');
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  },

  clearAll: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        reject('Failed to clear users');
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  },
};
