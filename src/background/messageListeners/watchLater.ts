import browser from 'webextension-polyfill'

export const setupWatchLaterMsgLstnr = () => {
  browser.runtime.onConnect.addListener(() => {
    browser.runtime.onMessage.addListener((message) => {
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B
      if (message.contentScriptQuery === 'saveToWatchLater') {
        const url = 'https://api.bilibili.com/x/v2/history/toview/add'
        return fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            csrf: message.csrf,
            aid: message.aid,
          }),
        })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E5%88%A0%E9%99%A4%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91
      else if (message.contentScriptQuery === 'removeFromWatchLater') {
        const url = 'https://api.bilibili.com/x/v2/history/toview/del'
        return fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            csrf: message.csrf,
            aid: message.aid,
          }),
        })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
    })
  })
}
