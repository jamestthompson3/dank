const CACHE_NAME = "posts-878502e1-3d46-40b8-a661-47bcb12cc5af";
const PAGES = [
  "./pandocoverride.css",
  "./style.css",
  "./space.png",
  "./reset.css",
  "./blog.css",
  "./index.html",
  "./vimloop.html",
  "./luanvim.html",
  "./frameworkpt2.html",
  "./frameworkpt1.html",
  "./frameworkintro.html",
  "./vimcandothat.html",
  "./datastructures.html",
  "./viiksetjs.html",
  "./rxjs-recompose.html",
  "./blogheader.js"
];

// install pages
self.addEventListener("install", e => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      self.skipWaiting(),
      deleteOldCaches()
    ])
      .then(cache => {
        console.log(cache);
        return cache[0].addAll(PAGES);
      })

      .catch(e => {
        console.log("ERROR in install: ", e);
      })
  );
});

self.addEventListener("activate", event => {
  console.log("ACTIVATING");
  event.waitUntil(clients.claim());
});

async function deleteOldCaches() {
  const keys = await caches.keys(CACHE_NAME);

  for (const key of keys) {
    if (CACHE_NAME !== key) {
      caches.delete(key);
    }
  }
}

self.addEventListener("fetch", event => {
  if (
    event.request.mode === "navigate" ||
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "image"
  ) {
    event.respondWith(cacheResponse(event.request, event));
  }
});

async function cacheResponse(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const match = await cache.match(request.url);
  if (match) {
    return match;
  }
  // Create promises for both the network response,
  // and a copy of the response that can be used in the cache.
  const fetchResponseP = fetch(request);
  const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

  event.waitUntil(
    (async function() {
      await cache.put(request, await fetchResponseCloneP);
    })()
  );

  return fetchResponseP;
}
