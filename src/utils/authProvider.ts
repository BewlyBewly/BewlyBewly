// import browser from 'webextension-polyfill'
import { accessKey } from '~/logic/storage'

import { appSign } from './appSign'

export function revokeAccessKey() {
  accessKey.value = null
}

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
