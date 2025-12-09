// public/sw.js
// Minimal service worker – just enough for PWA install.
// You can extend this later to cache assets for offline use.

self.addEventListener("install", (event) => {
  // Skip waiting so new SW takes over quickly.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim clients immediately so the SW is active on all tabs.
  event.waitUntil(self.clients.claim());
});

// (Optional) You can add fetch event caching here later.
