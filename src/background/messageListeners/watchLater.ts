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
        const url = `https://api.bilibili.com/x/v2/history/toview/del?${message.aid ? `aid=${message.aid}` : ''}`
        return fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            csrf: message.csrf,
            // aid: message.aid,
            viewed: message.viewed,
          }),
        })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E8%8E%B7%E5%8F%96%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
      else if (message.contentScriptQuery === 'getAllWatchLaterList') {
        const url = 'https://api.bilibili.com/x/v2/history/toview'
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E6%B8%85%E7%A9%BA%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
      else if (message.contentScriptQuery === 'clearAllWatchLater') {
        const url = 'https://api.bilibili.com/x/v2/history/toview/clear'
        return fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            csrf: message.csrf,
          }),
        })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
    })
  })
}
