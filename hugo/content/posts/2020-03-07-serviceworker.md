---
title: Build a Better Web with Service Workers
author: Taylor Thompson
tags: [javascript, service worker, web dev]
description: Make a better web experience with service workers.
date: 2020-03-07
loc: serviceworker
---

## Working Hard, or Hardly Working?

The Service Worker API is a powerful tool for providing better offline experiences, push notifications, and background syncing for web applications. Like me, you may be familiar with service workers from the role they play in creating Progressive Web Apps (PWAs), or from seeing them registered as part of the build output of `create-react-app`. While this automatic output from build tools such as `create-react-app` is very useful in getting started with PWAs, using the Service Worker API is much more beneficial to your application when tailored to your use cases. Let's dive into the Service Worker API to see how it provides a better user experience in some common use cases, starting with caching network responses.

A great place to start for any Web API is the MDN Page. In the case of the Service Worker API, MDN offers the [following paragraph](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) as an introduction:

> Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests and take appropriate action based on whether the network is available, and update assets residing on the server. They will also allow access to push notifications and background sync APIs.

Since service workers act as a man in the middle between the browser, network, and your application, their potential is huge! However, this means that the potential for abuse is also huge, and to combat this abuse, browsers have built in security measures around the Service Worker API. Some of these security measures are: service workers are _only_ registered over HTTPS or from your `localhost`, and only registered from the same origin as the current page. Working in Firefox, you enable service workers over HTTP in your developer tools console, and inspect and debug registered service workers in `about:debugging`.

## Cache Money

Content Caching is a great starting point for utilizing service workers, and tools like `create-react-app` implement by default. Caching static assets is one of the first steps in creating a PWA. Let's dive into caching by looking at the code for caching this blog for offline use! If you open up your devloper tools on the [homepage](https://teukka.tech) of this blog, you'll find an `index.js` file that has this content:

```js
function registerSW() {
  if (location.hostname === "localhost") return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw-prod.js").catch((e) => {
      console.log("Registration fail: ", e);
    });
  }
}

registerSW();
```

This is the code for registering the service worker for this site. On its own, it's not very compelling or informative, to really understand what's going on under the hood, we need to take a look at the `sw-prod.js` file. Inspect this file by opening Firefox's `about:debugging` in a new tab, selecting the service worker for this domain, and clicking `inspect` (or if it's not running, clicking `run`, and then `inspect`).

### What to cache

Now that you have the service worker code let's break it down:

```js
const CACHE_NAME = "posts-{someUUID}";
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
  "./vimtip-gitlens.html",
  "./frameworkpt2.html",
  "./frameworkpt1.html",
  "./frameworkintro.html",
  "./vimcandothat.html",
  "./datastructures.html",
  "./viiksetjs.html",
  "./proxies.html",
  "./rxjs-recompose.html",
  "./blogheader.js",
];

// install pages
self.addEventListener("install", installWorker);

async function installWorker(e) {
  await self.skipWaiting();
}
// ...continues below
```

### Service Worker life cycle

This snippet handles the installation event, as well assigning a value for the cache name and the pages to be initially cached. The interesting part of this code is the function that gets called on the `install` event. Installation is the first event in the [service worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerState), it gets kicked off by the `register` function in `index.js`. In our `installWorker` function, we call the `skipWaiting` method on the service worker, which causes the waiting service worker (in this case the one we are trying to install) to become the active service worker. Let's move on to the next section:

```js
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
  const oldVersions = keys.filter((name) => {
    if (/^posts-(\w{8}(-\w{4}){3}-\w{12}?)/.test(name)) {
      return true;
    } else {
      return false;
    }
  });
  return Promise.all(oldVersions.map((key) => caches.delete(key)));
}
// ...continues below
```

After the service worker is installed, it activates, calling the `activateServiceWorker` function we registered on the `activate` event. When our service worker is activated, we want to delete the old cache and install the current version of the files denoted in the `PAGES` array in the new cache. The function, `deleteOldCaches` gets all of the cache keys (which are the old versions of `CACHE_NAME`), and checks them to see if they match the format we've given to our `CACHE_NAME`. We don't simply clear _all_ the keys in the cache because we may have several service workers running at a time, and clearing their data may have unintended consequences, so this service worker only removes data that it has placed in the cache itself.

Installing the new versions of the blog posts requires opening a cache with the key of `CACHE_NAME`, and using the `addAll` method to specify that we want to add everything in the `PAGES` array to be added. After deleting old versions of the cache and installing the latest posts, the `clients.claim()` call allows the current service worker to become the active service worker on all pages in its scope. Wrapping `clients.claim()` inside of `event.waitUntil()` is an important step because it prevents the browser from interrupting the claim process which could lead to the service worker becoming active on some pages but not on others within its scope. Let's break down the final section:

```js
self.addEventListener("fetch", (event) => {
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
  const fetchResponseCloneP = fetchResponseP.then((r) => r.clone());

  event.waitUntil(
    (async function () {
      await cache.put(request, await fetchResponseCloneP);
    })()
  );

  return fetchResponseP;
}
```

### Going to the network

In this segment of the service worker code, we are adding an event listener for `fetch` events and responding with a cached response under certain conditions. The conditions we are checking before responding with cached response are: if the request is a navigation event (loading this blog post in your browser for example), or if the browser requests additional resources like CSS, Javascript, or images. To illustrate this flow, we'll take a look at two different resources requested by this website, `vimtip-gitlens.html` and `bb8_1.svg`.

Since `vimtip-gitlens.html` is specified in the `PAGES` array we cached on service worker activation, we'll look at it first. When you navigate to [the post](https://teukka.tech/vimtip-gitlens.html), the `event.respondWith` function is executed with the value from `cacheResponse` being evaluated. Using `event.respondWith` tells the service worker to intercept the request and respond with the argument passed to this function. Let's step through the `cacheResponse` function: we first open the current cache (as denoted with the `CACHE_NAME`) and check to see if there are any entries for the URL of the incoming request. If we've cached this URL before, we return the cached response--avoiding a network call. If the service worker can't find the URL from its cache, then makes a network request and places the response into the cache while returning the _Promise_ containing the response back to our main application. Putting the response in the cache is wrapped inside `event.waitUntil` to ensure that the browser does not interrupt the service worker while updating.

### Wrapping up

The final step in this example is making sure that the service worker always reflects the most up to date content. This means that every time we make a change to one of our cached assets, we update the `CACHE_NAME` in the service worker. For this blog, I created a bash script that helps ensure I don't forget to update my service worker cache:

```bash
#!/bin/bash

UUID=$(cat /proc/sys/kernel/random/uuid)
rm -f sw-prod.js
cp sw.js sw-prod.js
sed -i "s/%VERSION%/$UUID/g" sw-prod.js
echo "Built version: ${UUID}"
```

I use the `uuid` functionality built into Linux to generate a unique name for my cache, then I copy my service worker code with a placeholder for `CACHE_NAME` to the `sw-prod.js` file. The final step is to replace my placeholder cache name with the unique identifier I generated.

Caching static files is a great way to start using the Service Worker API, and offers your users a better offline experience. Stay tuned for more service worker tips!
