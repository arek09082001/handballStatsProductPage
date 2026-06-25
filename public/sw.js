// Empty service worker - no caching functionality
// This file exists to prevent 404 errors from browsers that automatically look for sw.js

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
