const CACHE_NAME = "posts-%VERSION%";
const PAGES = [
  "./ico.png",
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
self.addEventListener("install", installWorker);

async function installWorker(e) {
  await self.skipWaiting();
}

self.addEventListener("activate", activateServiceWorker);

async function activateServiceWorker(event) {
  await deleteOldCaches();
  await installCachedFiles();
  event.waitUntil(clients.claim()); // make the current sw the active sw in all cached pages
}

async function installCachedFiles() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(PAGES);
}

async function deleteOldCaches() {
  const keys = await caches.keys();
  const oldVersions = keys.filter(name => {
    if (/^posts-(\w{8}(-\w{4}){3}-\w{12}?)/.test(name)) {
      return true;
    } else {
      return false;
    }
  });
  return Promise.all(oldVersions.map(key => caches.delete(key)));
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