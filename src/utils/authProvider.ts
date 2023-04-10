/* eslint-disable no-throw-literal */
import browser from 'webextension-polyfill'
import { accessKey } from '~/logic/storage'

/**
 * 感謝這份專案給出的獲取accessKey的方法
 * https://github.com/indefined/UserScripts/blob/42e20281d2e4d7bce16b5c8033b67ccb6ad312e9/bilibiliHome/bilibiliHome.user.js#L1149
 */

// TODO: 解耦，避免直接操作DOM

export const revokeAccessKey = () => {
  accessKey.value = null
}

export const grantAccessKey = (element: HTMLButtonElement): void => {
  const originalInnerHTML = element.innerHTML
  element.innerHTML = `
    <span class="animate-pulse">Loading...</span>
  `
  element.style.pointerEvents = 'none'
  element.disabled = true

  const tip = 'Failed to grant Access Key'

  fetch(
    'https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3'
      + '&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a',
    {
      method: 'GET',
      credentials: 'include',
    },
  )
    .then(res => res.json())
    .then((data) => {
      if (data.code || !data.data)
        throw { tip, msg: data.msg || data.message || data.code, data }
      else if (!data.data.has_login)
        throw { tip, msg: 'Please login to bilibili first', data }
      else if (!data.data.confirm_uri)
        throw { tip, msg: 'Unable to receive verified URL. Please go back and try again.', data }
      else return data.data.confirm_uri
    })
    .then(
      url =>
        browser.runtime
          .sendMessage({
            contentScriptQuery: 'getAccessKey',
            confirmUri: url,
          })
          .then((res: { accessKey: string }) => {
            accessKey.value = res.accessKey
            return Promise.resolve()
          })
          .catch((err: any) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ tip, msg: 'Failed to get Access Key', data: err })
          }),
    )
    .catch((error) => {
      element.innerHTML = originalInnerHTML
      element.style.pointerEvents = 'auto'
      element.disabled = false

      // eslint-disable-next-line no-alert
      alert(`${error.tip}: ${error.msg}`)
      console.error(`${error.msg}: `, error.data)
    })
}
