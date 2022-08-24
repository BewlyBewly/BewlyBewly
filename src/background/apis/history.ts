import { API_URL } from '.'

export const setupHistoryAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getHistoryList') {
      const url = `https://${API_URL}/x/web-interface/history/cursor`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
