import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-window.prod.mjs'
import * as preact from '/web_modules/preact.js'
import { createStore } from '/web_modules/redux.js'
import { reducer, Provider } from './reducer.js'
import App from './App.js'

self.React = preact

const store = createStore(
  reducer,
  undefined,
  (self as any)?.__REDUX_DEVTOOLS_EXTENSION__?.(),
)

preact.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById('root')!,
)

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js')

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
