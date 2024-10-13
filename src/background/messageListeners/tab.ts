// import browser from 'webextension-polyfill'

// interface Message {
//   contentScriptQuery: string
//   [key: string]: any
// }

// browser.runtime.onMessage.addListener((message: Message, sender?: any, sendResponse?: Function) => {
//   if (message.contentScriptQuery === 'openLinkInNewTab') {
//     browser.tabs.create({ url: message.url, active: false }, (newTab) => {
//       console.log(`New tab created: ${newTab.id}`)
//       sendResponse({ message: 'Tab opened successfully!' })
//     })
//   }
// })
