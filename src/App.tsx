import { useEffect } from '/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'
import APIGetSheetValues from './APIGetSheetValues.js'
import OpeningView from './OpeningView.js'
import GameView from './GameView.js'
import CanvasView from './CanvasView.js'
import ResultView from './ResultView.js'

export default function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'APIGetSheetValues.Reload' })
  }, [])

  const viewMode = useSelector(state => state.viewMode)

  return (
    <>
      <APIGetSheetValues />

      {(() => {
        switch (viewMode) {
          case 'opening':
            return <OpeningView />

          case 'game':
            return <GameView />

          case 'canvas':
            return <CanvasView />

          case 'result':
            return <ResultView />

          default:
            const _: never = viewMode
            return <div>ERROR</div>
        }
      })()}
    </>
  )
}
