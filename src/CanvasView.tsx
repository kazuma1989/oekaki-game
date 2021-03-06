import css from '/app/web_modules/csz.js'
import { useEffect } from '/app/web_modules/preact/hooks.js'
import { useDispatch, useStore } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'
import Canvas, { useContext2D } from './Canvas.js'
import Timer from './Timer.js'

export default function CanvasView() {
  const dispatch = useDispatch()
  const passQuestion = () =>
    dispatch({
      type: 'passQuestion',
      payload: {
        dataURL: ctx.toWebp(),
      },
    })
  const correctQuestion = () =>
    dispatch({
      type: 'correctQuestion',
      payload: {
        dataURL: ctx.toWebp(),
      },
    })

  const ctx = useContext2D()
  const startDrawing = (x: number, y: number) => {
    dispatch({ type: 'draw.start', payload: { x, y } })
    ctx.start(x, y)
  }
  const draw = (x: number, y: number) => {
    dispatch({ type: 'draw.draw', payload: { x, y } })
    ctx.strokeTo(x, y)
  }
  const clearAll = () => {
    dispatch({ type: 'draw.clear' })
    ctx.clear()
  }

  const store = useStore()
  const redraw = () => {
    ctx.clear()

    store.getState().drawingHistory.forEach(action => {
      switch (action[0]) {
        case 'start': {
          const [, x, y] = action

          ctx.start(x, y)
          break
        }

        case 'draw': {
          const [, x, y] = action

          ctx.strokeTo(x, y)
          break
        }

        case 'clear': {
          ctx.clear()
          break
        }

        default: {
          const _: never = action
        }
      }
    })
  }
  const undo = () => {
    dispatch({ type: 'draw.undo' })
    // dispatch で state を変更してから再描画
    redraw()
  }

  // 画面リロード後、履歴データが残っていればそれを復活させる
  useEffect(redraw, [])

  return (
    <div className={style}>
      <Timer className={styleTimer} />

      <div className={styleFloating}>
        <IconButton label="↩️" onClick={undo} />
        <IconButton label="💣" onClick={clearAll} />
      </div>

      <div className={styleCanvasContainer}>
        <Canvas ctx={ctx} onPointStart={startDrawing} onPointMove={draw} />
      </div>

      <Button className={styleButton} label="パス" onClick={passQuestion} />
      <Button
        className={styleButton}
        theme="primary"
        label="正解!"
        onClick={correctQuestion}
      />
    </div>
  )
}

const style = css`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template:
    'canvas canvas' auto
    'button button' 15%
    / 50% 50%;
  gap: 2vw 0;
`

const styleTimer = css`
  position: fixed;
  top: 2vw;
  left: 2vw;
  z-index: 10;
`

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;

  > :not(:last-child) {
    margin-right: 2vw;
  }
`

const styleCanvasContainer = css`
  grid-area: canvas;
`

const styleButton = css`
  margin: 0 2vw 2vw 2vw;
  padding: 0;
`
