import browser from 'webextension-polyfill'

import { TAB_MESSAGE } from '~/background/messageListeners/tab'

export function openLinkInBackground(url: string) {
  return browser.runtime.sendMessage({
    contentScriptQuery: TAB_MESSAGE.OPEN_LINK_IN_BACKGROUND,
    url,
  })
}
