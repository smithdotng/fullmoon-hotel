// Service Worker for Full Moon Hotels PWA
const CACHE_NAME = 'fullmoon-hotels-v2.1';
const OFFLINE_URL = '/offline.html';

// URLs to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/css/bootstrap.css',
  '/css/animate.css',
  '/css/font-awesome.css',
  '/css/linear-icons.css',
  '/css/hotel-icons.css',
  '/css/magnific-popup.css',
  '/css/owl.carousel.css',
  '/css/datepicker.css',
  '/css/theme.css',
  '/js/jquery.min.js',
  '/js/jquery-ui.js',
  '/js/jquery.bootstrap.js',
  '/js/jquery.magnific-popup.js',
  '/js/jquery.owl.carousel.js',
  '/js/main.js',
  '/assets/images/header-1.jpg',
  '/assets/images/favicon.ico',
  '/assets/images/favicon-16x16.png',
  '/assets/images/favicon-32x32.png',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/room-1.jpg',
  '/assets/images/room-2.jpg',
  '/assets/images/room-4.jpg',
  '/assets/images/facility-gym.jpg',
  '/assets/images/facility-business.jpg',
  '/assets/images/facility-spa.jpg',
  '/assets/images/facility-event.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For API requests, network only
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/admin/') ||
      event.request.url.includes('/login') ||
      event.request.url.includes('/logout')) {
    return fetch(event.request);
  }
  
  // For static assets and pages
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache the response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // If it's a page request, show offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // Return empty response for other requests
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Sync forms function
function syncForms() {
  console.log('[Service Worker] Syncing forms...');
  // TODO: Implement form synchronization logic
  return Promise.resolve();
}

// Push notification event
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Full Moon Hotels',
    icon: '/assets/images/android-chrome-192x192.png',
    badge: '/assets/images/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/images/icon-check.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Full Moon Hotels', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});