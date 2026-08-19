/**
 * Offline Queue Manager using IndexedDB
 * Handles queueing of failed requests and Background Sync registration
 */

const DB_NAME = 'porto-bar-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-requests';

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  body: any;
  headers?: Record<string, string>;
  timestamp: number;
  syncTag: 'sync-orders' | 'sync-waiter-calls' | 'sync-reservations';
}

class OfflineQueueManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('syncTag', 'syncTag', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  async addToQueue(request: Omit<QueuedRequest, 'id' | 'timestamp'>): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const queuedRequest: QueuedRequest = {
        ...request,
        timestamp: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add(queuedRequest);
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      });

      console.log('[OfflineQueue] Request queued:', queuedRequest);

      // Register background sync
      await this.registerSync(request.syncTag);
    } catch (error) {
      console.error('[OfflineQueue] Failed to add to queue:', error);
      // Fallback to localStorage
      this.fallbackToLocalStorage(request);
    }
  }

  async getQueuedRequests(syncTag?: string): Promise<QueuedRequest[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const requests: QueuedRequest[] = [];

        if (syncTag) {
          const index = store.index('syncTag');
          const cursorRequest = index.openCursor(IDBKeyRange.only(syncTag));

          cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              requests.push(cursor.value);
              cursor.continue();
            } else {
              resolve(requests);
            }
          };
          cursorRequest.onerror = () => reject(cursorRequest.error);
        } else {
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
          getAllRequest.onerror = () => reject(getAllRequest.error);
        }
      });
    } catch (error) {
      console.error('[OfflineQueue] Failed to get queued requests:', error);
      return [];
    }
  }

  async removeFromQueue(id: number): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise<void>((resolve, reject) => {
        const deleteRequest = store.delete(id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });

      console.log('[OfflineQueue] Request removed from queue:', id);
    } catch (error) {
      console.error('[OfflineQueue] Failed to remove from queue:', error);
    }
  }

  async clearQueue(syncTag?: string): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      if (syncTag) {
        const requests = await this.getQueuedRequests(syncTag);
        for (const request of requests) {
          if (request.id) {
            await new Promise<void>((resolve, reject) => {
              const deleteRequest = store.delete(request.id!);
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = () => reject(deleteRequest.error);
            });
          }
        }
      } else {
        await new Promise<void>((resolve, reject) => {
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => resolve();
          clearRequest.onerror = () => reject(clearRequest.error);
        });
      }

      console.log('[OfflineQueue] Queue cleared');
    } catch (error) {
      console.error('[OfflineQueue] Failed to clear queue:', error);
    }
  }

  async registerSync(syncTag: 'sync-orders' | 'sync-waiter-calls' | 'sync-reservations'): Promise<void> {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
      console.warn('[OfflineQueue] Background Sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(syncTag);
      console.log(`[OfflineQueue] Background sync registered: ${syncTag}`);
    } catch (error) {
      console.error('[OfflineQueue] Failed to register sync:', error);
    }
  }

  private fallbackToLocalStorage(request: Omit<QueuedRequest, 'id' | 'timestamp'>): void {
    try {
      const key = `porto_offline_${request.syncTag}`;
      const existing = localStorage.getItem(key);
      const queue: QueuedRequest[] = existing ? JSON.parse(existing) : [];

      queue.push({
        ...request,
        timestamp: Date.now(),
      });

      localStorage.setItem(key, JSON.stringify(queue));
      console.log('[OfflineQueue] Fallback to localStorage');
    } catch (error) {
      console.error('[OfflineQueue] localStorage fallback failed:', error);
    }
  }
}

export const offlineQueue = new OfflineQueueManager();

export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to queue order submission
export async function queueOrderSubmission(orderData: any): Promise<void> {
  // Ensure the order has a unique client-side idempotency key to prevent double submits
  if (!orderData.idempotencyKey) {
    orderData.idempotencyKey = generateUUID();
  }

  await offlineQueue.addToQueue({
    url: '/api/orders',
    method: 'POST',
    body: orderData,
    headers: { 'Content-Type': 'application/json' },
    syncTag: 'sync-orders',
  });
}

// Helper function to queue waiter call
export async function queueWaiterCall(data: { tableNumber: string }): Promise<void> {
  await offlineQueue.addToQueue({
    url: '/api/orders',
    method: 'POST',
    body: {
      action: 'callWaiter',
      data,
    },
    headers: { 'Content-Type': 'application/json' },
    syncTag: 'sync-waiter-calls',
  });
}

// Helper function to queue reservation submission
export async function queueReservationSubmission(reservationData: any): Promise<void> {
  // Ensure the reservation has a unique client-side idempotency key to prevent double submits
  if (!reservationData.idempotencyKey) {
    reservationData.idempotencyKey = generateUUID();
  }

  await offlineQueue.addToQueue({
    url: '/api/reservations',
    method: 'POST',
    body: reservationData,
    headers: { 'Content-Type': 'application/json' },
    syncTag: 'sync-reservations',
  });
}

// Check if online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Client-side synchronization fallback for browsers without Background Sync (like iOS Safari)
export async function syncOfflineQueueManually(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return;

  try {
    const pending = await offlineQueue.getQueuedRequests();
    if (pending.length === 0) return;

    console.log(`[OfflineQueue] Manual sync: Found ${pending.length} pending requests`);

    for (const req of pending) {
      if (req.id === undefined) continue;

      try {
        const headers = req.headers || { 'Content-Type': 'application/json' };
        const res = await fetch(req.url, {
          method: req.method,
          headers,
          body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        });

        if (res.ok) {
          console.log(`[OfflineQueue] Manual sync: Request replayed successfully, ID: ${req.id}`);
          await offlineQueue.removeFromQueue(req.id);
        } else {
          console.warn(`[OfflineQueue] Manual sync: Replay failed with status: ${res.status}`);
        }
      } catch (err) {
        console.error(`[OfflineQueue] Manual sync: Failed to replay request ID ${req.id}:`, err);
      }
    }
  } catch (error) {
    console.error('[OfflineQueue] Error in manual sync:', error);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineQueueManually().catch(err => console.error('[OfflineQueue] Manual sync trigger failed:', err));
  });

  window.addEventListener('load', () => {
    if (navigator.onLine) {
      syncOfflineQueueManually().catch(err => console.error('[OfflineQueue] Startup sync trigger failed:', err));
    }
  });
}

