import browser from 'webextension-polyfill'

// import { onMessage, sendMessage } from 'webext-bridge'
import { setupAllMsgLstnrs } from './messageListeners'

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

// const previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }

//   let tab: Tabs.Tab

//   try {
//     tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }

//   // eslint-disable-next-line no-console
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
// })

// onMessage('get-current-tab', async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })

// // preinsert css
// browser.tabs.onUpdated.addListener((tabId: number, changInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
//   if (
//     // homepage
//     /https?:\/\/bilibili.com\/?$/.test(`${tab.url}`)
//     || /https?:\/\/bilibili.com\/index.html\/?$/.test(`${tab.url}`)
//     || /https?:\/\/www.bilibili.com\/index.html\/?$/.test(`${tab.url}`)
//     || /https?:\/\/www.bilibili.com\/?$/.test(`${tab.url}`)
//     || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(`${tab.url}`)
//     || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(`${tab.url}`)

//     // video page
//     || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(`${tab.url}`)
//     // watch later playlist
//     || /https?:\/\/(www.)?bilibili.com\/list\/watchlater.*/.test(`${tab.url}`)
//     // favorite playlist
//     || /https?:\/\/(www.)?bilibili.com\/list\/ml.*/.test(`${tab.url}`)
//     // search page
//     || /https?:\/\/search.bilibili.com\.*/.test(`${tab.url}`)
//     // moments page
//     || /https?:\/\/t.bilibili.com\.*/.test(`${tab.url}`)
//   ) {
//     if (changInfo.status === 'loading') {
//       // browser.scripting.insertCSS({
//       //   css: `
//       //   body {
//       //       opacity: 0;
//       //       transition: opacity 0.5s;
//       //       overflow-y: hidden;
//       //       pointer-events: none;
//       //   }
//       //   `,
//       //   target: {
//       //     tabId,
//       //   },
//       // })

//       browser.scripting.insertCSS({
//         css: resetCss,
//         target: {
//           tabId,
//         },
//       })

//       // If it not a macOS, we will inject CSS to design the scrollbar
//       if (!navigator.userAgent.includes('Mac OS X')) {
//         browser.scripting.insertCSS({
//           css: `
//             ::-webkit-scrollbar {
//               width: 8px;
//               height: 8px;
//             }

//             ::-webkit-scrollbar-track {
//               background: transparent;
//             }

//             html > ::-webkit-scrollbar-track {
//               background: var(--bew-bg);
//             }

//             ::-webkit-scrollbar-thumb {
//               background-color: rgba(120, 120, 122, 0.6);
//               border-radius: 20px;
//             }

//             ::-webkit-scrollbar-corner {
//               background: transparent;
//             }
//           `,
//           target: { tabId },
//         })
//       }
//     }
//     else if (changInfo.status === 'complete') {
//       // const css = `
//       // body {
//       //   opacity: 1;
//       //   overflow-y: auto;
//       //   pointer-events: auto;
//       // }
//       // `

//       // browser.scripting.insertCSS({
//       //   css,
//       //   target: { tabId },
//       // })
//     }
//   }
// })

// Setup all message listeners
browser.runtime.onConnect.removeListener(setupAllMsgLstnrs)
browser.runtime.onConnect.addListener(setupAllMsgLstnrs)
