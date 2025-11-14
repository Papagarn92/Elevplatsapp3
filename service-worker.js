const CACHE_NAME = 'platsdelning-v5';
const urlsToCache = [
    './',
    './index.html',
    './index-critical.html',
    './critical.html',
    './style.min.css',
    './style.css',
    './script.min.js',
    './script.js',
    './manifest.json',
    './favicon.ico',
    './icon-192.png',
    './icon-512.png',
    './apple-touch-icon.png',
    './test-pwa.html',
    './generate-icons.html',
    './sw-register.js',
    './service-worker.js',
    './PWA-README.md',
    './QUICK-START.md',
    './lighthouse-report-final.json',
    './lighthouse-report-optimized.json',
    './lighthouse-report.json'
];

// Install Event - Cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })))
                    .catch(err => {
                        console.warn('[Service Worker] Some resources failed to cache during bulk add:', err);
                        // Cache what we can, don't fail the entire installation
                        return Promise.all(
                            urlsToCache.map(url =>
                                cache.add(url).catch(e => {
                                    console.warn(`[Service Worker] Failed to cache ${url}: ${e.message}`);
                                    // Don't fail the entire installation for one failed resource
                                    return null;
                                })
                            )
                        );
                    });
            })
            .then(() => {
                console.log('[Service Worker] Installation completed');
                self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activation completed');
            return self.clients.claim();
        }).catch(error => {
            console.error('[Service Worker] Activation failed:', error);
        })
    );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Only handle GET requests for caching, let HEAD requests pass through
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the new resource
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                            console.log('[Service Worker] Cached new resource:', event.request.url);
                        })
                        .catch(error => {
                            console.warn('[Service Worker] Failed to cache:', event.request.url, error);
                        });

                    return response;
                }).catch((error) => {
                    console.error('[Service Worker] Fetch failed:', error);

                    // Return a custom offline page if available
                    if (event.request.destination === 'document') {
                        console.log('[Service Worker] Serving offline page');
                        return caches.match('./index.html');
                    }

                    throw error;
                });
            })
            .catch(error => {
                console.error('[Service Worker] Cache match failed:', error);
                throw error;
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('[Service Worker] Background sync triggered');
        event.waitUntil(syncData());
    }
});

// Test sync function for PWA tests
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TEST_SYNC') {
        console.log('[Service Worker] Test sync triggered');
        event.waitUntil(syncData());
    }
});

// Background sync function
async function syncData() {
    try {
        console.log('[Service Worker] Synkroniserar data i bakgrunden...');

        // Här kan du lägga till logik för att synkronisera data
        // Till exempel: skicka sparade ändringar till servern

        // För nu, bara logga framgång
        console.log('[Service Worker] Data synkroniserad framgångsrikt');

        // Du kan också skicka ett meddelande till klienten
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_SUCCESS',
                message: 'Data har synkroniserats i bakgrunden'
            });
        });

    } catch (error) {
        console.error('[Service Worker] Background sync misslyckades:', error);
        throw error;
    }
}

// Push Notifications (optional - for future enhancements)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Ny uppdatering tillgänglig',
        icon: './icon-192.png',
        badge: './icon-192.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('Platsdelning', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./')
    );
});
