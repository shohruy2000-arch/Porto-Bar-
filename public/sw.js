const CACHE_NAME = 'porto-bar-cache-v4';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/images/porto-app-icon-192.png',
  '/images/porto-app-icon-512.png',
  '/images/porto-app-icon-maskable.png',
  '/images/ichthys.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log('Pre-caching warning:', err));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept HTTP/GET requests (ignore api POSTs etc.)
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache static images and fonts dynamically
        const url = event.request.url;
        const isStaticAsset = url.includes('/fonts/') || 
                              url.includes('/images/') ||
                              url.endsWith('.png') ||
                              url.endsWith('.jpg') ||
                              url.endsWith('.svg');

        if (response && response.status === 200 && isStaticAsset) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// IndexedDB Helpers inside Service Worker for Background Sync replaying
function getQueuedRequests(syncTag) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('porto-bar-offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        resolve([]);
        return;
      }
      const transaction = db.transaction(['pending-requests'], 'readonly');
      const store = transaction.objectStore('pending-requests');
      const requests = [];
      
      try {
        const index = store.index('syncTag');
        const cursorRequest = index.openCursor(IDBKeyRange.only(syncTag));
        
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            requests.push(cursor.value);
            cursor.continue();
          } else {
            resolve(requests);
          }
        };
        cursorRequest.onerror = () => reject(cursorRequest.error);
      } catch (err) {
        const getAllReq = store.getAll();
        getAllReq.onsuccess = () => {
          const filtered = getAllReq.result.filter(r => r.syncTag === syncTag);
          resolve(filtered);
        };
        getAllReq.onerror = () => reject(getAllReq.error);
      }
    };
  });
}

function removeFromQueue(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('porto-bar-offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pending-requests'], 'readwrite');
      const store = transaction.objectStore('pending-requests');
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

async function processOfflineQueue(tag) {
  try {
    const pending = await getQueuedRequests(tag);
    for (const req of pending) {
      if (req.id === undefined) continue;
      try {
        const headers = req.headers || { 'Content-Type': 'application/json' };
        const res = await fetch(req.url, {
          method: req.method,
          headers: headers,
          body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
        });
        if (res.ok) {
          await removeFromQueue(req.id);
        }
      } catch (err) {
        console.error(`[SW Sync] Failed to replay request ID ${req.id}:`, err);
      }
    }
  } catch (error) {
    console.error(`[SW Sync] Error in processOfflineQueue:`, error);
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders' || event.tag === 'sync-waiter-calls' || event.tag === 'sync-reservations') {
    event.waitUntil(processOfflineQueue(event.tag));
  }
});

self.addEventListener('push', (event) => {
  let data = { title: 'Porto-Bar', body: 'Новое уведомление!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Porto-Bar', body: event.data.text() };
    }
  }

  const title = data.title || 'Porto-Bar';
  const options = {
    body: data.body,
    icon: data.icon || '/images/porto-logo.jpg?v=2',
    badge: data.badge || '/images/ichthys.jpg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data.url || '/';
      const absoluteTargetUrl = new URL(targetUrl, self.location.origin).href;

      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && client.url !== absoluteTargetUrl) {
            client.navigate(absoluteTargetUrl);
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(absoluteTargetUrl);
      }
    })
  );
});
