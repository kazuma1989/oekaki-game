import * as idb from '/app/web_modules/idb-keyval.js'
import * as preact from '/app/web_modules/preact.js'
import { createStore } from '/app/web_modules/redux.js'
import { reducer, Provider } from './reducer.js'
import { throttle } from './utils.js'

self.React = preact

import('./App.js').then(async ({ default: App }) => {
  const store = createStore(
    reducer,
    await idb.get('root-state'),
    self.__REDUX_DEVTOOLS_EXTENSION__?.(),
  )

  store.subscribe(throttle(() => idb.set('root-state', store.getState()), 1000))

  preact.render(
    <Provider value={store}>
      <App />
    </Provider>,
    document.getElementById('root')!,
  )
})

if ('serviceWorker' in navigator) {
  import('/app/web_modules/workbox-window.js').then(({ Workbox }) => {
    const wb = new Workbox('/app/sw.js')

    // https://developers.google.com/web/tools/workbox/modules/workbox-window#example-cache-urls
    wb.addEventListener('activated', () => {
      // Get the current page URL + all resources the page loaded.
      const urlsToCache = [
        location.href,
        ...performance.getEntriesByType('resource').map(r => r.name),
      ]

      // Send that list of URLs to your router in the service worker.
      wb.messageSW({
        type: 'CACHE_URLS',
        payload: { urlsToCache },
      })
    })

    wb.register()
  })
}
