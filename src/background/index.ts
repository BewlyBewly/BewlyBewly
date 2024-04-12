import browser from 'webextension-polyfill'

// import { onMessage, sendMessage } from 'webext-bridge'
import { setupAllMsgLstnrs } from './messageListeners'

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

// Setup all message listeners
setupAllMsgLstnrs()
