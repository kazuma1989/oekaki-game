import { useEffect, useState } from '/app/web_modules/preact/hooks.js'
import { useSelector } from './reducer.js'

const timeLimit = 300 * 1000

export default function Timer({ className }: { className?: string }) {
  const gameStartAt = useSelector(state => state.gameStartAt)

  const [currentTime, setCurrentTime] = useState(Date.now())
  const timeLeft = timeLimit - (currentTime - gameStartAt)

  const noTimeLeft = timeLeft <= 0
  useEffect(() => {
    if (noTimeLeft) return

    const timerId = setInterval(() => setCurrentTime(Date.now()), 1000)

    return () => clearInterval(timerId)
  }, [noTimeLeft])

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
