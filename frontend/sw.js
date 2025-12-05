self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("inventario-v1").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/css/style.css",
        "/js/app.js",
        "/js/ui.js",
        "/js/scanner.js",
        "/js/storage.js"
      ]);
    })
  );
});
