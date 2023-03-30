/**
 * get cookie by name
 * @param name cookie name
 * @returns cookie value
 */
export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts: Array<string> = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts?.pop()?.split(';').shift()
}

/**
 * set cookie
 * @param name cookie name
 * @param value cookie value
 */
export const setCookie = (name: string, value: any, expDays: number) => {
  const date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; domain=.bilibili.com; path=/`
}

/**
 * get current login user id
 * @returns userId
 */
export const getUserID = () => getCookie('DedeUserID')

/**
 * get csrf token
 */
export const getCSRF = () => getCookie('bili_jct')

/**
 * remove 'http://' or 'https://' from a URL
 * @param url
 * @returns
 */
export const removeHttpFromUrl = (url: string) => {
  return url.replace(/^https?:/, '')
}

export const openLinkToNewTab = (url: string) => {
  window.open(url, '_blank')
}

/**
 * convert a hex color value to RGBA, thanks ChatGPT 🫡
 * @param hex hex color value
 * @param alpha color opacity
 * @returns
 */
export const hexToRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`

  else
    return `rgb(${r}, ${g}, ${b})`
}
