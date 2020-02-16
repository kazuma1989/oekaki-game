import { useEffect, useState } from '/app/web_modules/preact/hooks.js'
import { useSelector } from './reducer.js'

export default function Timer({ className }: { className?: string }) {
  const gameStartAt = useSelector(state => state.gameStartAt)

  const [currentTime, setCurrentTime] = useState(Date.now())
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(Date.now()), 1000)

    return () => clearInterval(timerId)
  }, [])

  const timeLeft = 300 * 1000 - (currentTime - gameStartAt)

  return <div className={className}>{toMMSS(timeLeft)}</div>
}

function toMMSS(duration: number) {
  if (duration < 0) {
    return '0:00'
  }

  const msec = duration % 1000
  const sec = ((duration - msec) % 60000) / 1000
  const min = (duration - sec * 1000 - msec) / 60000

  const SS = sec.toString().padStart(2, '0')
  const MM = min.toString()

  return `${MM}:${SS}`
}
