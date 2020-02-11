export function throttle<A extends unknown[]>(
  func: (...args: A) => unknown,
  wait = 0,
): (...args: A) => void {
  // Fire immediately
  let prevTime = Date.now() - wait

  return function throttled(...args: A) {
    const currentTime = Date.now()
    if (currentTime - prevTime < wait) return

    prevTime = currentTime
    func(...args)
  }
}
