self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).then(function(resp){
        return caches.open('xiaohe-v1').then(function(cache){
          cache.put(e.request, resp.clone());
          return resp;
        });
      });
    })
  );
});
