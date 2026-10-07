const CACHE='clubline-pwa-v1.50.0';
const MENU_IMAGES=Array.from({length:16},(_,i)=>['mobile','desktop'].map(mode=>`./assets/menu/scene-${i}-framed-${mode}.webp?v=1.50.0`)).flat();
const SITE_IMAGES=['aberdeen','liverpool','manchester','cardiff','dublin','birmingham','glasgow','newcastle'].flatMap(id=>['day','evening'].map(time=>`./assets/sites/clubline-${id}-${time}.webp?v=1.50.0`));
const CORE=['./league-paper.js?v=1.50.0','./match-analysis.js?v=1.50.0','./match-insight.js?v=1.50.0','./match-life.js?v=1.50.0','./club-investment.js?v=1.46.0',...SITE_IMAGES.map(url=>url.replace('1.50.0','1.45.0')),'./assets/clubline-logo.svg?v=1.50.0','./season-calendar.js?v=1.45.0','./assets/menu/framing.json?v=1.50.0',...SITE_IMAGES,'./training.js?v=1.44.0','./recruitment.js?v=1.46.0','./contracts.js?v=1.44.0','./career-backup.js?v=1.46.0','./manifest.webmanifest?v=1.44.0','./assets/icon-137-192.png?v=1.44.0','./assets/icon-137-512.png?v=1.44.0','./assets/icon.svg?v=1.44.0','./season-board.js?v=1.44.0','./preferences.js?v=1.44.0','./assets/audio/menu-arcade.mp3','./assets/audio/menu-big-beat.mp3','./assets/audio/menu-indie.mp3','./assets/audio/menu-synth-pop.mp3','./scouting.js?v=1.44.0','./discipline.js?v=1.44.0','./audio.js?v=1.44.0','./assets/audio/menu-hip-hop.mp3','./assets/audio/menu-french-electro.mp3','./assets/audio/menu-fuzzy-rock.mp3','./assets/audio/crowd-cheer.mp3','./assets/audio/crowd-boo.mp3','./assets/audio/advance-tick.mp3','./stadium-surface.js?v=1.44.0','./transfer-search.js?v=1.44.0','./stadium-life.js?v=1.44.0','./match-life.js?v=1.44.0','./match-stats.js?v=1.44.0','./','./index.html','./app.js?v=1.50.0','./style.css?v=1.50.0','./data/league.json?v=1.44.0','./development.js?v=1.46.0','./scene.js?v=1.50.0','./stadium-model.js?v=1.44.0','./grounds-geometry.js','./sites.js','./sites.js?v=1.44.0','./stadium-life.js','./construction.js?v=1.44.0','./stadium-model.js'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(url=>new Request(url,{cache:'reload'}))).then(()=>Promise.all(MENU_IMAGES.map(url=>cache.add(new Request(url,{cache:'reload'})).catch(()=>{}))))).then(()=>self.skipWaiting()));
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
