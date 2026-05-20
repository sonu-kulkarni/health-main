const CACHE_NAME = "health-vault-v1"
const STATIC_ASSETS = ["/", "/manifest.json", "/favicon.ico"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request)
          .then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.ok) {
              const clonedResponse = fetchResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clonedResponse)
              })
            }
            return fetchResponse
          })
          .catch(() => {
            // Return cached response or offline page
            return caches.match(request)
          })
      )
    }),
  )
})
