import { useEffect, useRef } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'

export default function APIGetSheetValues() {
  const dispatch = useDispatch()

  const fetching = useRef<ReturnType<typeof fetchSheetValues> | null>(null)
  const awaitsLoading = useSelector(
    state =>
      state.loadingState === 'initial' ||
      state.loadingState === 'waiting' ||
      // preload で復帰してきたとき state は loading だが API が呼ばれていない状態になる
      (state.loadingState === 'loading' && !fetching.current),
  )

  useEffect(() => {
    if (!awaitsLoading) return

    dispatch({ type: 'APIGetSheetValues.Start' })

    fetching.current = fetchSheetValues()
    fetching.current.then(({ values: sheetValues }) => {
      fetching.current = null

      dispatch({ type: 'APIGetSheetValues.Complete', payload: { sheetValues } })
    })
  }, [awaitsLoading, dispatch])

  return null
}

export type Response = {
  values: {
    mainText: string
    subText?: string
  }[]
  totalCount: number
  perPage: number
  page: number
}

async function fetchSheetValues() {
  const data: Response = await fetch(
    'https://script.google.com/macros/s/AKfycbyp-IRHGH9ZgULsl5j2gs1WD1KS7K8npXDeVYS7sax264JAuaOp/exec?version=v2',
  ).then(r => r.json())

  return data
}
