import { useEffect, useState, useRef } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'

export default function TimeManager() {
  const dispatch = useDispatch()

  const timeLeftRef = useRef(0)
  const prevTimeLeft = timeLeftRef.current
  timeLeftRef.current = useTimer()

  const finishedJustNow = prevTimeLeft > 0 && timeLeftRef.current <= 0
  useEffect(() => {
    if (!finishedJustNow) return

    dispatch({ type: 'TimeManager.Finished' })
  }, [dispatch, finishedJustNow])

  return null
}

export function useTimer() {
  const [gameStartAt, timeLimit] = useSelector(state => [
    state.gameStartAt,
    state.timeLimit,
  ])

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
