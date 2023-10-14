import browser from 'webextension-polyfill'

function handleMessage(message: any) {

}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupRankingMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
