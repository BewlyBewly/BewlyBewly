import browser from 'webextension-polyfill'

export function setupHistoryMsgLstnr() {
  browser.runtime.onConnect.addListener(() => {
    browser.runtime.onMessage.addListener((message) => {
    // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E8%8E%B7%E5%8F%96%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%88%97%E8%A1%A8_web%E7%AB%AF
      if (message.contentScriptQuery === 'getHistoryList') {
        const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=${message.type}&view_at=${message.viewAt}`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      else if (message.contentScriptQuery === 'searchHistoryList') {
        const url = `https://api.bilibili.com/x/web-goblin/history/search?pn=${message.pn}&keyword=${message.keyword}&business=all`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E5%88%A0%E9%99%A4%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
      else if (message.contentScriptQuery === 'deleteHistoryItem') {
        const url = 'https://api.bilibili.com/x/v2/history/delete'
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: new URLSearchParams({
            kid: message.kid,
            csrf: message.csrf,
          }),
        })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
      else if (message.contentScriptQuery === 'clearAllHistory') {
        const url = 'https://api.bilibili.com/x/v2/history/clear'
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
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E6%9F%A5%E8%AF%A2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%81%9C%E7%94%A8%E7%8A%B6%E6%80%81
      else if (message.contentScriptQuery === 'getHistoryPauseStatus') {
        const url = 'https://api.bilibili.com/x/v2/history/shadow'
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E5%81%9C%E7%94%A8%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
      else if (message.contentScriptQuery === 'setHistoryPauseStatus') {
        const url = 'https://api.bilibili.com/x/v2/history/shadow/set'
        return fetch(url, {
          method: 'POST',
          body: new URLSearchParams({
            switch: message.switch,
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
