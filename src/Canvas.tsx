import css from '/app/web_modules/csz.js'
import { useRef, useMemo, Ref } from '/app/web_modules/preact/hooks.js'

export default function Canvas({
  ctx,
  onPointStart,
  onPointMove,
  onPointEnd,
  className = '',
}: {
  ctx?: Context2D
  onPointStart?(x: number, y: number): void
  onPointMove?(x: number, y: number): void
  onPointEnd?(x: number, y: number): void
  className?: string
}) {
  const mouseMoving = useRef(false)

  return (
    <canvas
      className={`${style} ${className}`}
      ref={ctx?.init}
      // Mouse
      onMouseDownCapture={e => {
        mouseMoving.current = true
        mouse(onPointStart)(e)
      }}
      onMouseMoveCapture={e => {
        if (!mouseMoving.current) return
        mouse(onPointMove)(e)
      }}
      onMouseUpCapture={e => {
        mouseMoving.current = false
        mouse(onPointEnd)(e)
      }}
      onMouseLeaveCapture={e => {
        mouseMoving.current = false
        mouse(onPointEnd)(e)
      }}
      // Touch
      onTouchStartCapture={touch(onPointStart)}
      onTouchMoveCapture={touch(onPointMove)}
      onTouchEndCapture={touch(onPointEnd)}
      onTouchCancelCapture={touch(onPointEnd)}
    />
  )
}

function mouse(handler?: (x: number, y: number) => void) {
  return (e: MouseEvent) => handler?.(e.offsetX, e.offsetY)
}

function touch(handler?: (x: number, y: number) => void) {
  return (e: TouchEvent) => {
    // 点を 1 つだけ描画したいのに touchstart, mousedown の 2 イベントが
    // 連続で発生してしまい、undo の回数が感覚より多くなってしまうのを防ぐ。
    // stopImmediatePropagation() では防止できなかった。
    e.preventDefault()

    const { touches } = e
    if (touches.length !== 1) return

    const [touch] = touches
    // FIXME 雑な座標取得
    handler?.(touch.clientX, touch.clientY)
  }
}

const style = css`
  width: 100%;
  height: 100%;
  display: block;

  user-select: none;
`

export function useContext2D(): Context2D {
  const ref = useRef<CanvasRenderingContext2D | null>(null)

  return useMemo(() => new Context2D(ref), [])
}

class Context2D {
  constructor(private readonly ref: Ref<CanvasRenderingContext2D | null>) {
    // `ref={ctx.init}` の形で呼ぶため
    this.init = this.init.bind(this)
  }

  init(canvas: HTMLCanvasElement | null) {
    if (!canvas) return

    if (!this.ref.current) {
      this.ref.current = canvas.getContext('2d')
    }

    // canvas.clientWidth/Height が計算されてからサイズ確定処理をする
    // そうしないと 0x0 の canvas になってしまって絵が描けない
    requestAnimationFrame(() => {
      // width か height が 0 だと canvas のレンダリングがまだかもしれない
      if (!canvas.clientWidth || !canvas.clientHeight) return
      // width/height を必要以上に再設定すると、描いている絵が消えてしまう
      if (
        canvas.width === canvas.clientWidth &&
        canvas.height === canvas.clientHeight
      )
        return

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    })
  }

  toWebp() {
    return this.ref.current?.canvas.toDataURL('image/webp') ?? 'data:,'
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
