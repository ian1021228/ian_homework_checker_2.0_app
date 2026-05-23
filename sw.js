const CACHE_NAME = 'homework-tracker-v1';
const BASE_URL = '/ian_homework_checker_2.0_app';

const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/manifest.json`,
    `${BASE_URL}/icon.png`
];

// 安裝 Service Worker，並在安裝後立即刪除舊快取
self.addEventListener('install', event => {
    self.skipWaiting(); // 強制等待中的 SW 進入啟動狀態
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// 啟動 Service Worker，並立即取得頁面控制權
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// 攔截請求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
// 攔截請求，確保這能啟動安裝程序
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
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
