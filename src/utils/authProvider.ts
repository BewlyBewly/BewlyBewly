// import browser from 'webextension-polyfill'
import { accessKey } from '~/logic/storage'

import { appSign } from './appSign'

export function revokeAccessKey() {
  accessKey.value = null
}

/**
 * 感謝這份專案給出的獲取accessKey的方法
 * https://github.com/indefined/UserScripts/blob/42e20281d2e4d7bce16b5c8033b67ccb6ad312e9/bilibiliHome/bilibiliHome.user.js#L1149
 */
// /**
//  * @deprecated
//  * @param t
//  * @param element
//  */
// export function grantAccessKey(t: any, element: HTMLButtonElement): void {
//   const originalInnerHTML = element.innerHTML
//   element.innerHTML = `
//     <span class="animate-pulse">Loading...</span>
//   `
//   element.style.pointerEvents = 'none'
//   element.disabled = true

//   const tip = t('auth.err_tip')
//   fetch(
//     'https://passport.bilibili.com/login/app/third?appkey=5fd5a7d8bfd9b0e6'
//     + '&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a',
//     {
//       method: 'GET',
//       credentials: 'include',
//     },
//   )
//     .then(res => res.json())
//     .then((data) => {
//       if (data.code || !data.data)
//         throw { tip, msg: data.msg || data.message || data.code, data }
//       else if (!data.data.has_login)
//         throw { tip, msg: t('auth.plz_login_first'), data }
//       else if (!data.data.confirm_uri)
//         throw { tip, msg: t('auth.receive_verified_url_err'), data }
//       else return data.data.confirm_uri
//     })
//     .then(
//       url =>
//         browser.runtime
//           .sendMessage({
//             contentScriptQuery: 'getAccessKey',
//             confirmUri: url,
//           })
//           .then((res: { accessKey: string }) => {
//             accessKey.value = res.accessKey
//             return Promise.resolve()
//           })
//           .catch((err: any) => {
//             // eslint-disable-next-line prefer-promise-reject-errors
//             return Promise.reject({ tip, msg: t('auth.failed_to_get_accesskey'), data: err })
//           }),
//     )
//     .catch((error) => {
//       element.innerHTML = originalInnerHTML
//       element.style.pointerEvents = 'auto'
//       element.disabled = false

//       alert(`${error.tip}: ${error.msg}`)
//       console.error(`${error.msg}: `, error.data)
//     })
// }

// https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/APPKey.html#appkey
export const TVAppKey = {
  appkey: '4409e2ce8ffd12b8',
  appsec: '59b43e04ad6965f34319062b478f83dd',
}

// https://github.com/magicdawn/bilibili-app-recommend/blob/e91722cc076fe65b98116fb0248236851ae6e1dc/src/utility/access-key/tv-qrcode/api.ts#L8
export function tvSignSearchParams(params: Record<string, any>) {
  const sign = appSign(params, TVAppKey.appkey, TVAppKey.appsec)
  return new URLSearchParams({
    ...params,
    sign,
  })
}

export function getTvSign(params: Record<string, any>) {
  return appSign(params, TVAppKey.appkey, TVAppKey.appsec)
}

export function pollTVLoginQRCode(authCode: string): Promise<any> {
  const url = 'https://passport.bilibili.com/x/passport-tv-login/qrcode/poll'

  return new Promise<void>((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: tvSignSearchParams({
        appkey: TVAppKey.appkey,
        auth_code: authCode,
        local_id: '0',
        ts: '0',
      }),
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export function getTVLoginQRCode(): Promise<any> {
  const url = 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code'

  return new Promise<void>((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: tvSignSearchParams({
        appkey: TVAppKey.appkey,
        local_id: '0',
        ts: '0',
      }),
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
