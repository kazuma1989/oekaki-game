import css from 'https://unpkg.com/csz'
import { useState, useEffect } from '/web_modules/preact/hooks.js'

export default function Timer({
  limitSecond,
  paused = false,
  onFinish,
}: {
  limitSecond: number
  paused?: boolean
  onFinish?(): void
}) {
  const [second, setSecond] = useState(limitSecond)
  const finished = second <= 0
  const decrement = () => setSecond(v => v - 1)

  useEffect(() => {
    if (paused) return

    if (finished) {
      onFinish?.()
      return
    }

    const timerId = setInterval(decrement, 1000)
    return () => clearInterval(timerId)
  }, [finished, paused])

  return <div class={style}>{toTimeString(second)}</div>
}

function toTimeString(second: number) {
  const ss = (second % 60).toString().padStart(2, '0')
  const mm = ((second - (second % 60)) / 60).toString().padStart(2, '0')

  return `${mm}:${ss}`
}

const style = css`
  display: flex;
  justify-content: center;
  align-items: center;
`
