const CACHE = 'gramseva-v73';
const ASSETS = ['./','./index.html','./schemes.js','./manifest.webmanifest','./icon.svg','./details.js','./notifications.js','./notifications.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gramseva-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('/notifications.json')) { e.respondWith(fetch(new Request(e.request, {cache:'no-store'}))); return; }
  if (e.request.mode === 'navigate' || url.pathname.endsWith('schemes.js') || url.pathname.endsWith('details.js') || url.pathname.endsWith('notifications.js')) {
    e.respondWith(fetch(new Request(e.request, {cache:'no-cache'})).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(m => m || fetch(e.request)));
});
