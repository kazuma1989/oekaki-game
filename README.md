[![Netlify Status](https://api.netlify.com/api/v1/badges/a65d05b3-e613-4ee1-a728-3bd563d56ed1/deploy-status)](https://app.netlify.com/sites/oekaki/deploys)

# memo

## todo

## URLs

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
