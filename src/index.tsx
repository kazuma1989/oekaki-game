import * as preact from '/app/web_modules/preact.js'
import { createStore } from '/app/web_modules/redux.js'
import { reducer, Provider } from './reducer.js'

self.React = preact

const store = createStore(
  reducer,
  undefined,
  (self as any)?.__REDUX_DEVTOOLS_EXTENSION__?.(),
)

const importApp = import('./App.js')
const awaitSplash = new Promise<void>(resolve => setTimeout(resolve, 400))

Promise.all([importApp, awaitSplash]).then(([{ default: App }]) => {
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

if (!['127.0.0.1', 'localhost'].includes(location.hostname)) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  window.addEventListener('beforeunload', event => {
    console.log('beforeunload')

    event.preventDefault()
    // Chrome requires returnValue to be set.
    // が、とくに設定した文字が表示されるわけでもない
    event.returnValue =
      'このサイトを離れてもよろしいですか？行った変更が保存されない可能性があります。'
  })
}

import('/app/web_modules/idb-keyval.js').then(({ set }) => {
  // FIXME 実験的（適当）実装
  store.subscribe(async () => {
    await set('my-store', store.getState())
  })
})
