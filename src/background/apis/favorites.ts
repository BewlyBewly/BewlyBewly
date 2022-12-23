import browser from 'webextension-polyfill'
import { API_URL } from '.'

export const setupFavoritesAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getHistoryList') {
      const url = `${API_URL}/x/v3/fav/folder/created/list-all?up_mid=${message.mid}&jsonp=jsonp`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
