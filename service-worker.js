const CACHE_NAME = 'leafmatch-v1';
const FILES_TO_CACHE = [
  '/', // Root page
  '/index.html', '/about.html', '/database.html', '/download.html', 
  '/help.html', '/plant.html', '/desktop.html', '/404.html', 
  '/unsupported.html', '/offline.html', '/plant_model.onnx', 
  '/css/styles.css', '/css/desktopstyles.css', '/css/pagestyles.css', 
  '/css/titlefont.ttf', '/scripts/scripts.js', '/scripts/desktopscripts.js', 
  '/scripts/ai.js', '/scripts/pagescripts.js', '/scripts/search.js', 
  '/scripts/database.js', '/images/ui/loading.png', '/images/ui/leaf.png', 
  '/images/ui/addfilesbutton.png', '/images/ui/cross.png', 
  '/images/ui/tick.png', '/images/ui/exitfullscreen.png', 
  '/images/ui/fullscreen.png', '/images/ui/logo.png', 
  '/images/ui/nocamera.jpg', '/images/ui/qr-code.png', 
  '/images/ui/sidebar.png', '/images/ui/switchcamera.png', 
  '/images/ui/takepicture.png', '/images/plants/placeholder.jpg'
];

// Install the service worker and cache all the required files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).catch(err => {
        console.error('Failed to cache essential files', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate the service worker and clear old caches if necessary
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event to handle network requests and serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // If we have a cached version, use it
      if (cached) {
        console.log(`Serving cached resource: ${event.request.url}`);
        return cached;
      }

      // Try fetching from the network, and then cache the response
      return fetch(event.request).then(response => {
        // Only cache successful responses for the same domain
        const cloned = response.clone();
        if (event.request.url.startsWith(self.location.origin) && response.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            console.log(`Caching new resource: ${event.request.url}`);
            cache.put(event.request, cloned);
          });
        }
        return response;
      }).catch(() => {
        // If it's a document and we're offline, return the offline page
        if (event.request.destination === 'document') {
          console.log('Network request failed, serving offline page.');
          return caches.match('/offline.html');
        }
      });
    })
  );
});
