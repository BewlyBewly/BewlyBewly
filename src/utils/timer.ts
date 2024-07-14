export function executeTimes(fn: () => void | Promise<void>, times: number, interval: number = 1000) {
  let count = 0
  const timer = setInterval(async () => {
    await fn()
    count++
    if (count >= times) {
      clearInterval(timer)
    }
  }, interval)
}
