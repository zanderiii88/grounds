const CACHE='clubline-pwa-v1.23.0';
const CORE=['./transfer-search.js?v=1.23.0','./stadium-life.js?v=1.23.0','./match-life.js?v=1.23.0','./match-stats.js?v=1.23.0','./','./index.html','./app.js?v=1.23.0','./style.css?v=1.23.0','./data/league.json?v=1.23.0','./development.js?v=1.23.0','./scene.js?v=1.23.0','./stadium-model.js?v=1.23.0','./grounds-geometry.js','./sites.js','./sites.js?v=1.23.0','./stadium-life.js','./construction.js?v=1.23.0','./stadium-model.js'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('grounds-pwa-')||key.startsWith('clubline-pwa-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 // Prefer current files online; only use saved files if the phone is offline.
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 }).catch(async()=>await caches.match(request)||Response.error()));
});
