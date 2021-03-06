import { useSelector } from './reducer.js'
import APIGetSheetValues from './APIGetSheetValues.js'
import TimeManager from './TimeManager.js'
import OpeningView from './OpeningView.js'
import ConfigView from './ConfigView.js'
import GameView from './GameView.js'
import CanvasView from './CanvasView.js'
import ResultView from './ResultView.js'
import GalleryView from './GalleryView.js'

export default function App() {
  const viewMode = useSelector(state => state.viewMode)

  return (
    <>
      <APIGetSheetValues />
      <TimeManager />

      {(() => {
        switch (viewMode) {
          case 'opening':
            return <OpeningView />

          case 'config':
            return <ConfigView />

          case 'game':
            return <GameView />

          case 'canvas':
            return <CanvasView />

          case 'result':
            return <ResultView />

          case 'gallery':
            return <GalleryView />

          default: {
            const _: never = viewMode

            return <div>ERROR</div>
          }
        }
      })()}
    </>
  )
}
