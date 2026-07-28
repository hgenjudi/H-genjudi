self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(e){
  // 只处理同源 GET 请求
  if(e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)){
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(resp){
      if(!resp || resp.status !== 200 || resp.type !== 'basic'){
        return resp;
      }
      return caches.open('xiaohe-v1').then(function(cache){
        cache.put(e.request, resp.clone());
        return resp;
      });
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
