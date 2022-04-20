import { createSharedComposable } from '@vueuse/core'
import { sendMessage, onMessage } from 'webext-bridge'
import { browserSettings, Tabs } from 'webextension-polyfill'
import { setupAllAPIs } from './apis'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async() => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

// preinsert css
browser.tabs.onUpdated.addListener((tabId: number, changInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  if (/https?:\/\/bilibili.com\/?$/.test(`${tab.url}`)
  || /https?:\/\/www.bilibili.com\/?$/.test(`${tab.url}`)
  || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(`${tab.url}`)
  || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(`${tab.url}`)) {
    if (changInfo.status === 'loading') {
      const css = `
      body {
        opacity: 0;
        transition: opacity 0.5s;
        overflow-y: hidden;
        pointer-events: none;
      }
      `

      browser.tabs.insertCSS(tabId, {
        code: css,
        runAt: 'document_start',
        matchAboutBlank: true,
      })

      // If it not a macOS, we will inject CSS to design the scrollbar
      if (!navigator.userAgent.includes('Mac OS X')) {
        browser.tabs.insertCSS(tabId, {
          code: `
            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: transparent;
            }

            html > ::-webkit-scrollbar-track {
              background: var(--bew-bg);
            }


            ::-webkit-scrollbar-thumb {
              background-color: var(--bew-fill-3);
              border-radius: 20px;
            }
          `,
          runAt: 'document_start',
          matchAboutBlank: true,
        })
      }
    }

    else if (changInfo.status === 'complete') {
      const css = `
      body {
        opacity: 1;
        overflow-y: auto;
        pointer-events: auto;
      }
      `

      browser.tabs.insertCSS(tabId, {
        code: css,
        runAt: 'document_start',
        matchAboutBlank: true,
      })
    }
  }
})

// Setup APIs
setupAllAPIs()
