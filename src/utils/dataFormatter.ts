import { settings } from '~/logic'
import { i18n } from '~/utils/i18n'

import { LanguageType } from './../enums/appEnums'

export const { t } = i18n.global

export function numFormatter(num: number) {
  const digits = 1 // specify number of digits after decimal
  let lookup

  if (settings.value.language === LanguageType.Mandarin_CN) {
    lookup = [
      { value: 1, symbol: ' ' },
      { value: 1e4, symbol: ' 万' },
      { value: 1e7, symbol: ' 千万' },
      { value: 1e8, symbol: ' 亿' },
    ]
  }
  else if (settings.value.language === LanguageType.Cantonese || settings.value.language === LanguageType.Mandarin_TW) {
    lookup = [
      { value: 1, symbol: ' ' },
      { value: 1e4, symbol: ' 萬' },
      { value: 1e7, symbol: ' 千萬' },
      { value: 1e8, symbol: ' 億' },
    ]
  }
  else {
    lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
    ]
  }
  const rx = /\.0+$|(\.\d*[1-9])0+$/
  const item = lookup.slice().reverse().find((item) => {
    return num >= item.value
  })
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export function calcTimeSince(date: number | string | Date) {
  const seconds = Math.floor(((Number(new Date())) - Number(date)) / 1000)
  let interval = seconds / 31536000
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.year', Math.floor(interval))}`
  interval = seconds / 2592000
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.month', Math.floor(interval))}`
  interval = seconds / 604800
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.week', Math.floor(interval))}`
  interval = seconds / 86400
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.day', Math.floor(interval))}`
  interval = seconds / 3600
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.hour', Math.floor(interval))}`
  interval = seconds / 60
  if (interval > 1)
    return `${Math.floor(interval)} ${t('common.minute', Math.floor(interval))}`
  return `${Math.floor(interval)} ${t('common.second', Math.floor(interval))}`
}

export function calcCurrentTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (hours <= 0)
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}
