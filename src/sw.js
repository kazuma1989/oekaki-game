importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
)

const { precacheAndRoute } = workbox.precaching
const { registerRoute } = workbox.routing
const { StaleWhileRevalidate } = workbox.strategies

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new RegExp('https://unpkg\\.com/.+'), new StaleWhileRevalidate())
