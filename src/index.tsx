import * as preact from '/app/web_modules/preact.js'
import { createStore } from '/app/web_modules/redux.js'
import { reducer, Provider, State } from './reducer.js'
import StateStorage from './StateStorage.js'
import { debounce, throttle } from './utils.js'
import CacheClear from './CacheClear.js'

self.React = preact
const { render } = preact

import('./App.js').then(({ default: App }) => {
  const storage = new StateStorage<State>()

  const store = createStore(
    reducer,
    storage.get(),
    self.__REDUX_DEVTOOLS_EXTENSION__?.(),
  )

  const save = () => storage.set(store.getState())
  save()
  store.subscribe(debounce(save, 1000))
  store.subscribe(throttle(save, 12 * 1000))

  render(
    <Provider value={store}>
      <CacheClear storage={storage} />

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
