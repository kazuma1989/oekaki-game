# memo

- https://www.flaticon.com/free-icon/easel_2492998
- https://squoosh.app
- https://www.aconvert.com/icon/svg-to-ico/

## https://github.com/NekR/self-destroying-sw

```js
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', async () => {
  await self.registration.unregister()

  const clients = await self.clients.matchAll()

  clients.forEach(client => client.navigate(client.url))
})
```
