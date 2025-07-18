const CACHE_NAME = 'leafmatch-v1';
const FILES_TO_CACHE = [
  '/', 
  '/index.html', '/about.html', '/download.html', '/help.html', '/plant.html', '/desktop.html', 
  '/404.html', '/offline.html', '/unsupported.html', '/plant_model.onnx', 
  '/css/styles.css', '/css/desktopstyles.css', '/css/pagestyles.css', 
  '/css/titlefont.ttf', '/scripts/scripts.js', '/scripts/desktopscripts.js', 
  '/scripts/ai.js', '/scripts/pagescripts.js', '/scripts/search.js', 
  '/scripts/database.js', '/images/ui/loading.png', '/images/ui/leaf.png', 
  '/images/ui/addfilesbutton.png', '/images/ui/cross.png', 
  '/images/ui/tick.png', '/images/ui/exitfullscreen.png', 
  '/images/ui/fullscreen.png', '/images/ui/logo.png', '/images/ui/nocamera.jpg', 
  '/images/ui/qr-code.png', '/images/ui/sidebar.png', '/images/ui/switchcamera.png', 
  '/images/ui/takepicture.png', '/images/plants/placeholder.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const cachePromises = FILES_TO_CACHE.map(file => {
        return fetch(file)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${file}`);
            }
            return cache.put(file, response);
          })
          .catch(err => {
            console.error(`Failed to cache ${file}:`, err);
          });
      });
      return Promise.all(cachePromises);
    }).catch(err => {
      console.error('Error opening cache or caching files:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).catch(err => {
      console.error('Error cleaning up old caches:', err);
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('/plant')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          return cached;
        }
        return fetch(event.request).then(response => {
          const cloned = response.clone();
          if (event.request.url.startsWith(self.location.origin) && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cloned);
            });
          }
          return response;
        }).catch((err) => {
          return caches.match('/offline.html');
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          return cached;
        }
        return fetch(event.request).then(response => {
          const cloned = response.clone();
          if (event.request.url.startsWith(self.location.origin) && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, cloned);
            });
          }
          return response;
        }).catch((err) => {
          if (event.request.destination === 'image') {
            return caches.match('/images/ui/placeholder.jpg');
          }
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      }).catch(err => {
        console.error('Error during cache match:', err);
      })
    );
  }
});
