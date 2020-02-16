import { useEffect, useState } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'

export default function TimeManager() {
  const dispatch = useDispatch()
  const timeLeft = useTimer()

  const noTimeLeft = timeLeft <= 0
  useEffect(() => {
    if (!noTimeLeft) return

    dispatch({ type: 'TimeManager.Finished' })
  }, [noTimeLeft])

  return null
}

const timeLimit = 300 * 1000

export function useTimer() {
  const gameStartAt = useSelector(state => state.gameStartAt)

  const [currentTime, setCurrentTime] = useState(Date.now())
  const timeLeft = timeLimit - (currentTime - gameStartAt)

  const noTimeLeft = timeLeft <= 0
  useEffect(() => {
    if (noTimeLeft) return

    const timerId = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(timerId)
  }, [noTimeLeft])

  return timeLeft
}
