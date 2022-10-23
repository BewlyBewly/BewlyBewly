import { grantAccessKey, revokeAccessKey } from './authProvider'
import { SVG_ICONS } from './svgIcons'
import { i18n } from './i18n'

export { grantAccessKey, revokeAccessKey, SVG_ICONS, i18n }
export * from './dataFormatter'

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
