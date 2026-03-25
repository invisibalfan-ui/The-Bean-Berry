const CACHE = "snackstall-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/bean.html",
  "/login.html",
  "/items.html",
  "/track.html",
  "/live.html",
  "/widget.html",
  "/style.css",
  "/script.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});