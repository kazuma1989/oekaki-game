import css from '/app/web_modules/csz.js'
import { useState, useRef } from '/app/web_modules/preact/hooks.js'
import { useDispatch, useStore } from './reducer.js'
import Button from './Button.js'
import IconButton from './IconButton.js'

export default function CanvasView() {
  const dispatch = useDispatch()
  const passQuestion = () => dispatch({ type: 'passQuestion' })
  const correctQuestion = () => dispatch({ type: 'correctQuestion' })

  const [drawing, setDrawing] = useState(false)
  const ref = useRef<CanvasRenderingContext2D | null>(null)
  const ctx = new Context2D(ref)
  const startDrawing = (x: number, y: number) => {
    setDrawing(true)
    dispatch({ type: 'draw.start', payload: { x, y } })
    ctx.start(x, y)
  }
  const draw = (x: number, y: number) => {
    if (!drawing) return

    dispatch({ type: 'draw.draw', payload: { x, y } })
    ctx.strokeTo(x, y)
  }
  const finishDrawing = () => {
    setDrawing(false)
  }
  const clearAll = () => {
    dispatch({ type: 'draw.clear' })
    ctx.clear()
  }

  const store = useStore()
  const undo = () => {
    dispatch({ type: 'draw.undo' })

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

  return (
    <div className={style}>
      <div className={styleFloating}>
        <IconButton label="↩️" onClick={undo} />
        <IconButton label="💣" onClick={clearAll} />
      </div>

      <div className={styleCanvas}>
        <canvas
          ref={canvas => ctx.init(canvas)}
          onMouseDown={e => startDrawing(e.offsetX, e.offsetY)}
          onMouseMove={e => draw(e.offsetX, e.offsetY)}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          onTouchStart={e => {
            e.preventDefault()

            const { touches } = e
            if (touches.length !== 1) return

            const [touch] = touches
            // FIXME 雑な座標取得
            startDrawing(touch.clientX, touch.clientY)
          }}
          onTouchMove={e => {
            e.preventDefault()

            const { touches } = e
            if (touches.length !== 1) return

            const [touch] = touches
            // FIXME 雑な座標取得
            draw(touch.clientX, touch.clientY)
          }}
          onTouchEnd={finishDrawing}
          onTouchCancel={finishDrawing}
        />
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

type Ref<T> = { current: T }

class Context2D {
  constructor(private readonly ref: Ref<CanvasRenderingContext2D | null>) {}

  init(canvas: HTMLCanvasElement | null) {
    if (!canvas) return

    if (!this.ref.current) {
      this.ref.current = canvas.getContext('2d')
    }

    if (
      canvas.width !== canvas.clientWidth &&
      canvas.height !== canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
  }

  start(x: number, y: number) {
    this.drawDot(x, y)
    this.beginPath(x, y)
  }

  strokeTo(x: number, y: number) {
    const ctx = this.ref.current
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  clear() {
    const ctx = this.ref.current
    if (!ctx) return

    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
  }

  private drawDot(x: number, y: number) {
    const ctx = this.ref.current
    if (!ctx) return

    const dotSize = ctx.lineWidth * 3
    ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize)
  }

  private beginPath(x: number, y: number) {
    const ctx = this.ref.current
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }
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

const styleFloating = css`
  position: fixed;
  top: 2vw;
  right: 2vw;
  z-index: 10;

  > :not(:last-child) {
    margin-right: 2vw;
  }
`

const styleCanvas = css`
  grid-area: canvas;

  > canvas {
    width: 100%;
    height: 100%;
    display: block;

    user-select: none;
  }
`

const styleButton = css`
  margin: 0 2vw 2vw 2vw;
  padding: 0;
`
