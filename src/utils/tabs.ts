import browser from 'webextension-polyfill'

import { TABS_MESSAGE } from '~/background/messageListeners/tabs'

export function openLinkInBackground(url: string) {
  return browser.runtime.sendMessage({
    contentScriptQuery: TABS_MESSAGE.OPEN_LINK_IN_BACKGROUND,
    url,
  })
}
