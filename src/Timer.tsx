import { useTimer } from './TimeManager.js'

export default function Timer({ className }: { className?: string }) {
  const timeLeft = useTimer()

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
