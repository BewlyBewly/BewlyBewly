import browser from 'webextension-polyfill'
import { API_URL } from '.'

export const setupNotificationsAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getUnreadMsg') {
      const url = `${API_URL}/x/msgfeed/unread?build=0&mobi_app=web`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'getUnreadDm') {
      const url = 'https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread?build=0&mobi_app=web&unread_type=0'
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
