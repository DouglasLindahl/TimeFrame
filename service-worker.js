const cacheVersion = "v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheVersion).then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/favicon.ico",
        "/css/styles.css",
        "/js/main.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve cached assets if available, or fetch from network
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Cache the fetched response for future use
          return caches.open(cacheVersion).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});

// Push Notification Handler
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/logo/Logomark_TimeFrame_Vit_T.png",
    badge: "/logo/Logomark_TimeFrame_Vit_T.png",
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification Title", options)
  );
});
