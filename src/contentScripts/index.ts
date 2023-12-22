// import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'

import 'uno.css'
import '~/styles/index.ts'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { SVG_ICONS } from '~/utils/svgIcons'
import { injectCSS } from '~/utils/main'

const isFirefox: boolean = /Firefox/i.test(navigator.userAgent)

const beforeLoadedStyleEl: HTMLStyleElement = injectCSS(`
  html.dark.bewly-design {
    background-color: hsl(230 12% 6%);
  }

  body {
    opacity: 0;
    background: none;
  }
`)

// Add opacity transition effect for page loaded
injectCSS(`
  body {
    transition: opacity 0.5s;
  }
`)

if (isFirefox) {
  let isFirstScriptExecute = true
  document.addEventListener('beforescriptexecute', () => {
    document.documentElement.removeChild(beforeLoadedStyleEl)
    if (!isFirstScriptExecute)
      return

    setTimeout(() => {
      injectApp()
    }, 1000)
    isFirstScriptExecute = false
  })
}
else {
  document.addEventListener('DOMContentLoaded', () => {
    // nextTick(() => {
    //   setTimeout(() => {
    //     document.body.style.opacity = '1'
    //     document.documentElement.removeChild(beforeLoadedStyleEl)
    //   }, 300)
    // })

    injectApp()
  })
}

function injectApp() {
  const currentUrl = document.URL

  if (
    // homepage
    /https?:\/\/bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl)

    // video page
    || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(currentUrl)
    // anime playback & movie page
    || /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(currentUrl)
    // watch later playlist
    || /https?:\/\/(www.)?bilibili.com\/list\/watchlater.*/.test(currentUrl)
    // favorite playlist
    || /https?:\/\/(www.)?bilibili.com\/list\/ml.*/.test(currentUrl)
    // search page
    || /https?:\/\/search.bilibili.com\.*/.test(currentUrl)
    // moments
    || /https?:\/\/t.bilibili.com\.*/.test(currentUrl)
    // moment detail
    || /https?:\/\/www.bilibili.com\/opus\/.*/.test(currentUrl)
    // history page
    || /https?:\/\/(www.)?bilibili.com\/account\/history.*/.test(currentUrl)
    // user space page
    || /https?:\/\/space.bilibili.com\.*/.test(currentUrl)
    // notifications page
    || /https?:\/\/message.bilibili.com\.*/.test(currentUrl)
    // bilibili channel page b站分区页面
    || /https?:\/\/www.bilibili.com\/v\/.*/.test(currentUrl)
    // anime page
    || /https?:\/\/www.bilibili.com\/anime.*/.test(currentUrl)
    // tv shows, movie, variety shows, mooc page
    || /https?:\/\/(www.)?bilibili.com\/(tv|movie|variety|mooc).*/.test(currentUrl)
  ) {
    if (
      /https?:\/\/bilibili.com\/?$/.test(currentUrl)
      || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
      || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
      || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
      || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl)
    ) {
      const originalPageContent = document.querySelector('#i_cecream')
      if (originalPageContent)
        originalPageContent.innerHTML = ''
    }

    // mount component to context window
    const container = document.createElement('div')
    container.id = 'bewly'
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    container.style.opacity = '0'
    container.style.transition = 'opacity 0.5s'
    styleEl.onload = () => {
      setTimeout(() => {
        container.style.opacity = '1'
      }, 500)
    }

    const newStyleEl = document.createElement('link')
    newStyleEl.setAttribute('rel', 'stylesheet')
    newStyleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    document.documentElement.appendChild(newStyleEl)
    newStyleEl.onload = () => {
      setTimeout(() => {
        document.documentElement.removeChild(beforeLoadedStyleEl)
      }, 500)
    }

    // inject svg icons
    const svgDiv = document.createElement('div')
    svgDiv.innerHTML = SVG_ICONS
    shadowDOM.appendChild(svgDiv)

    document.body.appendChild(container)

    const app = createApp(App)
    setupApp(app)
    app.mount(root)
  }
}
