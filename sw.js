const CACHE_NAME = "deme-pwa-v3";
const ASSETS = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",(e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",(e)=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",(e)=>{
  const req = e.request;
  e.respondWith((async()=>{
    const cached = await caches.match(req, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const res = await fetch(req);
      return res;
    }catch(err){
      return caches.match("./index.html");
    }
  })());
});