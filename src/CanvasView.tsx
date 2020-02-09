import css from '/app/web_modules/csz.js'
import { useState, useRef } from '/app/web_modules/preact/hooks.js'
import { useDispatch, useStore } from './reducer.js'
import Button from './Button.js'
import CloseButton from './CloseButton.js'

export default function CanvasView() {
  const dispatch = useDispatch()
  const passQuestion = () => dispatch({ type: 'passQuestion' })
  const correctQuestion = () => dispatch({ type: 'correctQuestion' })

  const [ctxRef, initCanvas] = useCanvasRenderingContext2D()
  const [drawing, setDrawing] = useState(false)
  const startDrawing = (x: number, y: number) => {
    const ctx = ctxRef.current
    if (!ctx) return

    setDrawing(true)
    dispatch({ type: 'draw.start', payload: { x, y } })

    // Draw a dot
    const dotSize = ctx.lineWidth * 3
    ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize)

    // Start a path
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const draw = (x: number, y: number) => {
    if (!drawing) return

    const ctx = ctxRef.current
    if (!ctx) return

    dispatch({ type: 'draw.draw', payload: { x, y } })

    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const finishDrawing = () => {
    setDrawing(false)
  }
  const clearAll = () => {
    const ctx = ctxRef.current
    if (!ctx) return

    dispatch({ type: 'draw.clear' })

    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
  }

  const store = useStore()
  const undo = () => {
    const ctx = ctxRef.current
    if (!ctx) return

    dispatch({ type: 'draw.undo' })

    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)

    store.getState().drawingHistory.forEach(action => {
      switch (action[0]) {
        case 'start': {
          const [, x, y] = action

          // Draw a dot
          const dotSize = ctx.lineWidth * 3
          ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize)

          // Start a path
          ctx.beginPath()
          ctx.moveTo(x, y)
          break
        }

        case 'draw': {
          const [, x, y] = action

          ctx.lineTo(x, y)
          ctx.stroke()
          break
        }

        case 'clear': {
          const { width, height } = ctx.canvas
          ctx.clearRect(0, 0, width, height)
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
      <CloseButton floating data-label="&#x1F4A3;" onClick={undo} />

      <div className={styleCanvas}>
        <canvas
          ref={initCanvas}
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

function useCanvasRenderingContext2D() {
  const ref = useRef<CanvasRenderingContext2D | null>(null)

  return [
    ref,
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return

      if (!ref.current) {
        ref.current = canvas.getContext('2d')
      }

      if (
        canvas.width !== canvas.clientWidth &&
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }
    },
  ] as const
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
