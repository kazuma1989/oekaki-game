import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-window.prod.mjs'
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
