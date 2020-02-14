importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js',
)

/** @type { import('workbox-precaching') } */
const { precacheAndRoute } = workbox.precaching
/** @type { import('workbox-routing') } */
const { registerRoute } = workbox.routing
/** @type { import('workbox-strategies') } */
const { CacheFirst } = workbox.strategies

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new RegExp('https://unpkg\\.com/.+'), new CacheFirst())
