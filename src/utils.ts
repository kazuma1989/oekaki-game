export function debounce<A extends unknown[]>(
  func: (...args: A) => unknown,
  wait = 0,
): (...args: A) => void {
  let debouncing: ReturnType<typeof setTimeout>

  return function debounced(...args: A) {
    clearTimeout(debouncing)

    debouncing = setTimeout(() => func(...args), wait)
  }
}

export function throttle<A extends unknown[]>(
  func: (...args: A) => unknown,
  wait = 0,
): (...args: A) => void {
  // Fire the first call immediately
  let prevTime = Date.now() - wait

  return function throttled(...args: A) {
    const currentTime = Date.now()
    if (currentTime - prevTime < wait) return

    prevTime = currentTime
    func(...args)
  }
}
