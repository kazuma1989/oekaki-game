import { useEffect, useState } from '/app/web_modules/preact/hooks.js'
import { useSelector, useDispatch } from './reducer.js'

export default function TimeManager() {
  const dispatch = useDispatch()
  const timeLeft = useTimer()

  const noTimeLeft = timeLeft <= 0
  const nonGameView = useSelector(
    state => state.viewMode === 'opening' || state.viewMode === 'config',
  )

  const gameFinished = !nonGameView && noTimeLeft
  useEffect(() => {
    if (!gameFinished) return

    dispatch({ type: 'TimeManager.Finished' })
  }, [dispatch, gameFinished])

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
