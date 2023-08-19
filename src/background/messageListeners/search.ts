import browser from 'webextension-polyfill'

export function setupSearchMsgLstnr() {
  browser.runtime.onConnect.addListener(() => {
    browser.runtime.onMessage.addListener((message) => {
      if (message.contentScriptQuery === 'getSearchSuggestion') {
        const url = `https://s.search.bilibili.com/main/suggest?term=${message.term}`
        return fetch(url)
          .then(response => response.json())
          .then(data => (data))
          .catch(error => console.error(error))
      }
    })
  })
}
