import browser from 'webextension-polyfill'

export const setupHistoryAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E8%8E%B7%E5%8F%96%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%88%97%E8%A1%A8_web%E7%AB%AF
    if (message.contentScriptQuery === 'getHistoryList') {
      const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=${message.type}&view_at=${message.viewAt}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
    // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E5%88%A0%E9%99%A4%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
    else if (message.contentScriptQuery === 'deleteHistoryItem') {
      const url = `https://api.bilibili.com/x/v2/history/delete?kid=${message.kid}&csrf=${message.csrf}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
