const CACHE_NAME = 'homework-tracker-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// 安裝 Service Worker 並快取基本檔案
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// 攔截網路請求，若有快取則優先使用快取
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // 若在快取中找到，則回傳快取
            if (response) {
                return response;
            }
            // 否則透過網路請求
            return fetch(event.request);
        })
    );
});

// 清理舊版本的快取
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
