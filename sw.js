const CACHE = 'gramseva-v94';
const BASE=new URL('./',self.location).pathname;
const DATA_SHA='cdf2075108d41ba7dccb0781a21442b7e2b3d95a6df93415b4d29648f2571301';
const ASSETS = ['./','./index.html','./schemes.js?v=94','./manifest.webmanifest','./icon.svg','./icon-192-v3.png','./icon-512-v3.png','./icon-maskable-v3.png','./apple-touch-icon-v3.png','./details.js?v=94','./search.js?v=94','./directory.js?v=94','./notifications.js','./notifications.json','./resources.js','./utilities.js','./fonts/Ramabhadra-Regular.ttf'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const entries=await Promise.all(ASSETS.map(async path=>{const r=await fetch(new Request(path,{cache:'reload'}));if(!r.ok)throw Error('Incomplete release');if(path.startsWith('./schemes.js')){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await r.clone().arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==DATA_SHA)throw Error('Release data has not propagated')}return[path,r]}));
 const c=await caches.open(CACHE);await Promise.all(entries.map(([path,r])=>c.put(path,r)));await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys(),upgrading=keys.some(k=>k.startsWith('gramseva-')&&k!==CACHE);
 await Promise.all(keys.filter(k=>k.startsWith('gramseva-')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
 if(upgrading){const windows=await self.clients.matchAll({type:'window'});windows.filter(c=>new URL(c.url).pathname.startsWith(BASE)).forEach(c=>{c.navigate(c.url).catch(()=>{})})}
})()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname.endsWith('/notifications.json')) { e.respondWith(fetch(new Request(e.request, {cache:'no-store'}))); return; }
  if (e.request.mode === 'navigate' || url.pathname.endsWith('schemes.js') || url.pathname.endsWith('details.js') || url.pathname.endsWith('search.js') || url.pathname.endsWith('directory.js') || url.pathname.endsWith('notifications.js') || url.pathname.endsWith('resources.js') || url.pathname.endsWith('utilities.js') || url.pathname.endsWith('manifest.webmanifest')) {
    e.respondWith(fetch(new Request(e.request, {cache:'no-cache'})).then(async r => { if(!r.ok)throw Error('Network unavailable');if(url.pathname.endsWith('schemes.js')){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await r.clone().arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==DATA_SHA)throw Error('Stale release data')}  const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(m => m || fetch(e.request)));
});
