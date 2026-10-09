const CACHE='clubline-pwa-v1.52.1';
const MENU_IMAGES=Array.from({length:16},(_,i)=>['mobile','desktop'].map(mode=>`./assets/menu/scene-${i}-framed-${mode}.webp?v=1.52.1`)).flat();
const SITE_IMAGES=['aberdeen','liverpool','manchester','cardiff','dublin','birmingham','glasgow','newcastle'].flatMap(id=>['day','evening'].map(time=>`./assets/sites/clubline-${id}-${time}.webp?v=1.52.1`));
const KITS=Array.from({length:20},(_,i)=>Array.from({length:3},(_,k)=>`./assets/kits/kit-${i+1}-${k}.svg`)).flat();
const PILOT_ASSETS=Array.from({length:20},(_,i)=>'C'+String(i+1).padStart(2,'0')).flatMap(id=>['back','front'].map(layer=>`./assets/surroundings/${id}-${layer}.webp?v=1.52.1`));
const CORE=['./assets/clubline-99-cover-mobile.webp','./assets/clubline-99-cover-mobile.webp?v=1.52.1','./assets/clubline-99-cover.webp','./assets/clubline-99-cover.webp?v=1.52.1','./assets/fonts/clubline-condensed-regular.woff','./assets/fonts/clubline-condensed-bold.woff','./assets/icon-180.png?v=1.52.1','./assets/icon-192.png?v=1.52.1','./assets/icon-512.png?v=1.52.1','./assets/icon-maskable-192.png?v=1.52.1','./assets/icon-maskable-512.png?v=1.52.1','./fixed-surroundings.js','./fixed-surroundings.js?v=1.52.1',...PILOT_ASSETS,...KITS,...KITS.map(x=>x.replace('kit-','kit-shirt-')),'./friendlies.js?v=1.52.1','./match-insight.js?v=1.52.1','./match-life.js?v=1.52.1','./club-investment.js?v=1.52.1',...SITE_IMAGES.map(url=>url.replace('1.48.0','1.45.0')),'./assets/clubline-logo.svg?v=1.52.1','./season-calendar.js?v=1.52.1','./assets/menu/framing.json?v=1.52.1',...SITE_IMAGES,'./training.js?v=1.52.1','./recruitment.js?v=1.52.1','./contracts.js?v=1.52.1','./career-backup.js?v=1.52.1','./manifest.webmanifest?v=1.52.1','./assets/icon-137-192.png?v=1.52.1','./assets/icon-137-512.png?v=1.52.1','./assets/icon.svg?v=1.52.1','./season-board.js?v=1.52.1','./preferences.js?v=1.52.1','./assets/audio/menu-arcade.mp3','./assets/audio/menu-big-beat.mp3','./assets/audio/menu-indie.mp3','./assets/audio/menu-synth-pop.mp3','./scouting.js?v=1.52.1','./discipline.js?v=1.52.1','./audio.js?v=1.52.1','./assets/audio/menu-hip-hop.mp3','./assets/audio/menu-french-electro.mp3','./assets/audio/menu-fuzzy-rock.mp3','./assets/audio/crowd-cheer.mp3','./assets/audio/crowd-boo.mp3','./assets/audio/advance-tick.mp3','./stadium-surface.js?v=1.52.1','./transfer-search.js?v=1.52.1','./stadium-life.js?v=1.52.1','./match-life.js?v=1.52.1','./match-stats.js?v=1.52.1','./','./index.html','./app.js?v=1.52.1','./style.css?v=1.52.1','./data/league.json?v=1.52.1','./development.js?v=1.52.1','./scene.js?v=1.52.1','./stadium-model.js?v=1.52.1','./grounds-geometry.js','./sites.js','./sites.js?v=1.52.1','./stadium-life.js','./construction.js?v=1.52.1','./stadium-model.js'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...new Set(CORE)].map(url=>new Request(url,{cache:'reload'}))).then(()=>Promise.all(MENU_IMAGES.map(url=>cache.add(new Request(url,{cache:'reload'})).catch(()=>{}))))).then(()=>self.skipWaiting()));
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
