const CACHE_NAME = 'homework-tracker-v5'; // 變更版號，強制更新
const BASE_URL = '/ian_homework_checker_2.0_app';

const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/manifest.json`,
    `${BASE_URL}/icon.png`
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 🔥 【完美離線架構】Network-First 策略：確保有網路時先抓最新的網頁，斷線才用快取！
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // 如果網路正常，順便把最新版本存入快取
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => {
                // 如果斷網（或伺服器無回應），才退回使用快取版本
                return caches.match(event.request);
            })
    );
});
