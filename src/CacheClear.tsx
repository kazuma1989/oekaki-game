import { useEffect, useRef } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'
import StateStorage from './StateStorage.js'

export default function CacheClear({ storage }: { storage?: StateStorage }) {
  const dispatch = useDispatch()

  const fetching = useRef<Promise<unknown> | null>(null)
  const awaitsLoading = useSelector(
    state =>
      state.cacheClearingState === 'waiting' ||
      // preload で復帰してきたとき state は loading だが API が呼ばれていない状態になる
      (state.cacheClearingState === 'loading' && !fetching.current),
  )

  useEffect(() => {
    if (!awaitsLoading) return

    dispatch({ type: 'clearCache.Start' })

    fetching.current = Promise.all([
      navigator.serviceWorker
        .getRegistrations()
        .then(registrations =>
          Promise.all(registrations.map(r => r.unregister())),
        ),
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))),
      storage?.clear(),
    ])

    fetching.current.then(() => {
      fetching.current = null

      dispatch({ type: 'clearCache.Complete' })

      location.reload()
    })
  }, [awaitsLoading, dispatch, storage])

  return null
}
