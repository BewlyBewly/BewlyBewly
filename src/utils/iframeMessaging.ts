import browser from 'webextension-polyfill'

import type { AppPage } from '~/enums/appEnums'
import { useSettingsStore } from '~/stores/settingsStore'

const { getDockItemConfigByPage } = useSettingsStore()
interface Message {
  contentScriptQuery: string
  [key: string]: any
}

export enum IFRAME_MESSAGE {
  IFRAME_CHANGE_PAGE_MODE = 'iframeChangePageMode',
}

export function iframeChangePageMode(page: AppPage, useOriginalBiliPage: boolean) {
  browser.runtime.sendMessage({
    contentScriptQuery: IFRAME_MESSAGE.IFRAME_CHANGE_PAGE_MODE,
    page,
    useOriginalBiliPage,
  })
}

function handleMessage(message: Message) {
  if (message.contentScriptQuery === IFRAME_MESSAGE.IFRAME_CHANGE_PAGE_MODE) {
    const { page, useOriginalBiliPage } = message
    const dockItemConfig = getDockItemConfigByPage(page)
    if (dockItemConfig) {
      dockItemConfig.useOriginalBiliPage = useOriginalBiliPage
    }
  }
}

export function setupIframeMsgLstnrs() {
  browser.runtime.onMessage.removeListener(handleConnect)
  browser.runtime.onMessage.addListener(handleConnect)
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}
