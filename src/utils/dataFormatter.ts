export const numFormatter = (num: number) => {
  const digits = 1 // specify number of digits after decimal
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup.slice().reverse().find((item) => {
    return num >= item.value
  })
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export const calcTimeSince = (date: any) => {
  const seconds = Math.floor(((new Date() as any) - date) / 1000)
  let interval = seconds / 31536000
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} years` : `${Math.floor(interval)} year`}`
  interval = seconds / 2592000
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} months` : `${Math.floor(interval)} month`}`
  interval = seconds / 604800
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} weeks` : `${Math.floor(interval)} week`}`
  interval = seconds / 86400
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} days` : `${Math.floor(interval)} day`}`
  interval = seconds / 3600
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} hours` : `${Math.floor(interval)} hour`}`
  interval = seconds / 60
  if (interval > 1)
    return `${Math.floor(interval) > 1 ? `${Math.floor(interval)} minutes` : `${Math.floor(interval)} minute`}`
  return `${Math.floor(seconds) > 1 ? `${Math.floor(seconds)} seconds` : `${Math.floor(seconds)}second`}`
}

export const calcCurrentTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (hours <= 0)
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}
