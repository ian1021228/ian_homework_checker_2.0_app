const CACHE_NAME = 'homework-tracker-v3';
const BASE_URL = '/ian_homework_checker_2.0_app';

const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/manifest.json`,
    `${BASE_URL}/icon.png`
];

// 安裝時只做檔案快取，不使用 skipWaiting() 強制踢掉當前網頁
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('正在預先快取基本檔案');
            return cache.addAll(urlsToCache);
        })
    );
});

// 啟用時也不使用 clients.claim()，讓使用者重新整理或下次點進來才生效，不干涉目前的瀏覽
self.addEventListener('activate', event => {
    console.log('Service Worker 已就緒');
});

// 標準的網路請求攔截
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
