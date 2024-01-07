/**
 * get cookie by name
 * @param name cookie name
 * @returns cookie value
 */
export function getCookie(name: string): string {
  const value = `; ${document.cookie}`
  const parts: Array<string> = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts?.pop()?.split(';').shift() || ''
}

/**
 * set cookie
 * @param name cookie name
 * @param value cookie value
 */
export function setCookie(name: string, value: any, expDays: number) {
  const date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; domain=.bilibili.com; path=/`
}

/**
 * get current login user id
 * @returns userId
 */
export const getUserID = (): string => getCookie('DedeUserID')

/**
 * get csrf token
 */
export const getCSRF = (): string => getCookie('bili_jct')

/**
 * remove 'http://' or 'https://' from a URL
 * @param url
 * @returns
 */
export function removeHttpFromUrl(url: string): string {
  return url.replace(/^https?:/, '')
}

export function openLinkToNewTab(url: string) {
  window.open(url, '_blank')
}

/**
 * convert a hex color value to RGBA, thanks ChatGPT 🫡
 * @param hex hex color value
 * @param alpha color opacity
 * @returns
 */
export function hexToRGBA(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  if (alpha)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`

  else
    return `rgb(${r}, ${g}, ${b})`
}

/**
 * smooth scroll to the top of the html element
 */
export function smoothScrollToTop(element: HTMLElement, duration: number, targetScrollTop = 0 as number) {
  // cancel if already on top
  if (element.scrollTop === targetScrollTop)
    return

  const cosParameter = (element.scrollTop - targetScrollTop) / 2
  let scrollCount = 0
  let oldTimestamp = 0

  function step(newTimestamp: number) {
    if (oldTimestamp !== 0) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration
      if (scrollCount >= Math.PI)
        return (element.scrollTop = targetScrollTop)
      element.scrollTop = targetScrollTop + cosParameter + cosParameter * Math.cos(scrollCount)
    }
    oldTimestamp = newTimestamp
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}

export function injectCSS(css: string): HTMLStyleElement {
  const el = document.createElement('style')
  el.setAttribute('rel', 'stylesheet')
  el.textContent = css
  document.documentElement.appendChild(el)
  return el
}

/**
 * delay
 * @param time delay time
 */
export function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/**
 * Check if the current page is the home page
 * @returns true if the current page is the home page
 */
export function isHomePage(): boolean {
  if (
    /https?:\/\/bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(location.href)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(location.href)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(location.href)
  )
    return true
  return false
}
