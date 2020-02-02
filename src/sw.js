importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js',
)

const { precacheAndRoute } = workbox.precaching
const { registerRoute } = workbox.routing
const { StaleWhileRevalidate } = workbox.strategies

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new RegExp('https://unpkg\\.com/.+'), new StaleWhileRevalidate())
