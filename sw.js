// Last Contract Ultimate Edition service worker.
const CACHE = 'last-contract-ultimate-v2';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './game.css',
  './campaign-expansion.js', './progression.js', './game.js',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('last-contract-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put('./index.html',copy)); return response; }).catch(()=>caches.match('./index.html')));
    return;
  }
  if (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (response.ok || response.type === 'opaque') { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(request,copy)); }
      return response;
    })));
  }
});
