/* eslint-disable no-throw-literal */
import { accessKey } from '~/logic/storage'

/**
 * 感謝這份專案給出的獲取accessKey的方法
 * https://github.com/indefined/UserScripts/blob/42e20281d2e4d7bce16b5c8033b67ccb6ad312e9/bilibiliHome/bilibiliHome.user.js#L1149
 */

export const revokeAccessKey = () => {
  accessKey.value = null
}

export const grantAccessKey = (element: HTMLButtonElement): void => {
  const orginalInnerHTML = element.innerHTML
  element.innerHTML = `
    <span class="animate-pulse">Loading...</span>
  `
  element.style.pointerEvents = 'none'

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
      if (data.code || !data.data) throw { tip, msg: data.msg || data.message || data.code, data }
      else if (!data.data.has_login) throw { tip, msg: 'Please login to bilibili first', data }
      else if (!data.data.confirm_uri) throw { tip, msg: 'Unable to receive verified URL. Please go back and try againe.', data }
      else return data.data.confirm_uri
    })
    .then(
      url =>
        new Promise<void>((resolve, reject) => {
          const iframe = document.createElement('iframe')
          iframe.src = url
          iframe.style.display = 'none'
          document.body.appendChild(iframe)

          const timeout = setTimeout(() => {
            document.body.contains(iframe) && document.body.removeChild(iframe)
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ tip, msg: 'Request timeout' })
          }, 5000)

          window.addEventListener('message', (ev) => {
            if (`${ev.origin}` !== 'https://www.mcbbs.net' || !ev.data) return
            const key = ev.data.match(/access_key=([0-9a-z]{32})/)
            if (key) {
              accessKey.value = key[1]
              clearTimeout(timeout)
              document.body.contains(iframe) && document.body.removeChild(iframe)
              resolve()
            }
            else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({ tip, msg: 'Failed to get Access Key', data: ev })
            }
          })
        }),
    )
    .catch((error) => {
      element.innerHTML = orginalInnerHTML
      element.style.pointerEvents = 'auto'

      // eslint-disable-next-line no-alert
      alert(`${error.tip}: ${error.msg}`)
      console.error(`${error.msg}: `, error.data)
    })
}
