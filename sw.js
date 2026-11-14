/* Service worker de Guerra de Facciones: solo maneja su propia carpeta (/guerra-de-facciones/). */
const CACHE='gdf-202611140008';
const CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('gdf-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin||!u.pathname.startsWith(new URL('./',self.registration.scope).pathname))return;
 const net=()=>fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res});
 /* página y cartas: primero la red (para recibir actualizaciones), si no hay conexión, lo guardado */
 if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('.json')){e.respondWith(net().catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('index.html'))));return}
 /* imágenes y demás: lo guardado primero, y se actualiza por detrás */
 e.respondWith(caches.match(r).then(x=>{const f=net().catch(()=>x);return x||f}))});
