const CACHE_NAME = 'leafmatch-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/plant_model.onnx',
  '/desktop.html',
  '/about.html',
  '/database.html',
  '/download.html',
  '/help.html',
  '/plant.html',
  '/404.html',
  '/unsupported.html',
  '/offline.html',
  '/css/styles.css',
  '/css/desktopstyles.css',
  '/css/pagestyles.css',
  '/css/titlefont.ttf',
  '/scripts/scripts.js',
  '/scripts/desktopscripts.js',
  '/scripts/ai.js',
  '/scripts/pagescripts.js',
  '/scripts/search.js',
  '/scripts/database.js',
  '/images/ui/loading.png',
  '/images/ui/leaf.png',
  '/images/ui/addfilesbutton.png',
  '/images/ui/cross.png',
  '/images/ui/tick.png',
  '/images/ui/exitfullscreen.png',
  '/images/ui/fullscreen.png',
  '/images/ui/logo.png',
  '/images/ui/nocamera.jpg',
  '/images/ui/qr-code.png',
  '/images/ui/sidebar.png',
  '/images/ui/switchcamera.png',
  '/images/ui/takepicture.png',
  'images/plants/placeholder.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const cloned = response.clone();
        if (
          event.request.url.startsWith(self.location.origin) &&
          response.status === 200
        ) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
