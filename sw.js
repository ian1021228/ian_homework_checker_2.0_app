const CACHE_NAME = 'homework-tracker-v4';
const BASE_URL = '/ian_homework_checker_2.0_app';

const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/manifest.json`,
    `${BASE_URL}/icon.png`
];

// 1. 安裝時只安靜地快取基本檔案，絕對不使用 skipWaiting()
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// 2. 啟用時安靜就緒，絕對不使用 clients.claim() 強制抓取網頁
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

// 3. 標準網路請求：如果網頁開著，優先從網路抓最新的；沒網路才用快取（這樣就不會白屏了！）
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
