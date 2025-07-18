importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Workbox loaded');

  workbox.precaching.precacheAndRoute([
    { url: '/', revision: null },
    { url: '/index.html', revision: null },
    { url: '/about.html', revision: null },
    { url: '/download.html', revision: null },
    { url: '/help.html', revision: null },
    { url: '/plant.html', revision: null },
    { url: '/desktop.html', revision: null },
    { url: '/404.html', revision: null },
    { url: '/offline.html', revision: null },
    { url: '/unsupported.html', revision: null },
    { url: '/plant_model.onnx', revision: null },
    { url: '/css/styles.css', revision: null },
    { url: '/css/desktopstyles.css', revision: null },
    { url: '/css/pagestyles.css', revision: null },
    { url: '/css/titlefont.ttf', revision: null },
    { url: '/scripts/scripts.js', revision: null },
    { url: '/scripts/desktopscripts.js', revision: null },
    { url: '/scripts/ai.js', revision: null },
    { url: '/scripts/pagescripts.js', revision: null },
    { url: '/scripts/search.js', revision: null },
    { url: '/scripts/database.js', revision: null },
    { url: '/images/ui/loading.png', revision: null },
    { url: '/images/ui/leaf.png', revision: null },
    { url: '/images/ui/addfilesbutton.png', revision: null },
    { url: '/images/ui/cross.png', revision: null },
    { url: '/images/ui/tick.png', revision: null },
    { url: '/images/ui/exitfullscreen.png', revision: null },
    { url: '/images/ui/fullscreen.png', revision: null },
    { url: '/images/ui/logo.png', revision: null },
    { url: '/images/ui/nocamera.jpg', revision: null },
    { url: '/images/ui/qr-code.png', revision: null },
    { url: '/images/ui/sidebar.png', revision: null },
    { url: '/images/ui/switchcamera.png', revision: null },
    { url: '/images/ui/takepicture.png', revision: null },
    { url: '/images/plants/placeholder.jpg', revision: null },
  ]);

  // 🧭 Handle navigations (like going between pages)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
      ],
    })
  );

  // 🎨 Cache CSS & JS assets
  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // 🖼 Cache image assets with fallback
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 100 }),
      ],
    })
  );

  // 🧯 Fallbacks for failed requests
  workbox.routing.setCatchHandler(async ({ request }) => {
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    if (request.destination === 'image') {
      return caches.match('/images/plants/placeholder.jpg');
    }
    return Response.error(); // default fallback
  });

} else {
  console.error('❌ Workbox did not load');
}
