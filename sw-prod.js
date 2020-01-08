const CACHE_NAME = "posts-fdb64ef9-d6c0-49ee-94ad-95d293405f21";
const PAGES = [
  `./pandocoverride.css`,
  `./style.css`,
  `./space.png`,
  `./reset.css`,
  `./blog.css`,
  `./index.html`,
  `./vimloop.html`,
  `./luanvim.html`,
  `./frameworkpt2.html`,
  `./frameworkpt1.html`,
  `./frameworkintro.html`,
  `./vimcandothat.html`,
  `./datastructures.html`,
  `./viiksetjs.html`,
  `./rxjs-recompose.html`
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
        return cache[0].addAll(PAGES);
      })

      .catch(e => {
        console.log("ERROR in install: ", e);
      })
  );
});

async function deleteOldCaches() {
  const keys = await caches.keys(CACHE_NAME);

  for (const key of keys) {
    console.log(key);
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
  const match = await caches.match(request.clone(), { cacheName: CACHE_NAME });
  if (match) {
    return match;
  }
  // Create promises for both the network response,
  // and a copy of the response that can be used in the cache.
  const fetchResponseP = fetch(request.clone());
  const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

  event.waitUntil(
    (async function() {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, await fetchResponseCloneP);
    })()
  );

  return fetchResponseP;
}
