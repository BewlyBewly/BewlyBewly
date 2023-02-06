import browser from 'webextension-polyfill'

export const setupHistoryAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getHistoryList') {
      const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=${message.type}&view_at=${message.viewAt}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
