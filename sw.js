const CACHE_NAME = 'xiaohe-v2';

self.addEventListener('install', function(e){
  self.skipWaiting();
  // 安装时清空旧缓存
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.map(function(name){ return caches.delete(name); }));
    })
  );
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
    // 始终网络优先，确保每次都获取最新版本
    fetch(e.request).then(function(resp){
      return resp;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
