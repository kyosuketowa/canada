// Service Worker for Edmonton Travel Itinerary PWA
const CACHE_NAME = 'edmonton-itinerary-v4';
const urlsToCache = [
  './',
  './index.html',
  './itinerary.html',
  './manifest.json',
  './images/icon.svg',
  './images/hero.jpg',
  './images/mall.jpg',
  './images/art.jpg',
  './images/legislature.jpg',
  './images/hockey.jpg',
  './images/bakery.jpg',
  './images/cafe.jpg',
  './images/steak.jpg',
  './images/timhortons.jpg',
  './images/banff.jpg',
  './images/jasper.jpg',
  './images/winter-clothing.jpg'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
