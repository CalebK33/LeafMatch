const CACHE_NAME = 'leafmatch-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
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
  '/images/plants/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // control all pages immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
