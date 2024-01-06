import browser from 'webextension-polyfill'

function handleMessage(message: any) {
  if (message.contentScriptQuery === 'getSearchSuggestion') {
    const url = `https://s.search.bilibili.com/main/suggest?term=${message.term}&highlight=`
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupSearchMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
