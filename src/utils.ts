export function throttle<A extends unknown[]>(
  func: (...args: A) => unknown,
  wait = 0,
): (...args: A) => void {
  // Fire the first call immediately
  let prevTime = Date.now() - wait
  // Fire trailing calls after wait
  let trailingCall: ReturnType<typeof setTimeout>

  return function throttled(...args: A) {
    clearTimeout(trailingCall)

    const currentTime = Date.now()
    const remaining = wait - (currentTime - prevTime)
    if (remaining > 0) {
      trailingCall = setTimeout(() => func(...args), remaining)
      return
    }

    prevTime = currentTime
    func(...args)
  }
}
