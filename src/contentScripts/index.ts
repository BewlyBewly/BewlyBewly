// import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'

import 'uno.css'
import '~/styles/index.ts'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { SVG_ICONS } from '~/utils/svgIcons'
import { injectCSS, isHomePage } from '~/utils/main'
import { settings } from '~/logic'
import { runWhenIdle } from '~/utils/lazyLoad'

const currentUrl = document.URL

function isSupportedPage() {
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
   || /https?:\/\/(www.)?bilibili.com\/(tv|movie|variety|mooc).*/.test(currentUrl))
    return true
  else
    return false
}

const isFirefox: boolean = /Firefox/i.test(navigator.userAgent)

let beforeLoadedStyleEl: HTMLStyleElement
if (isSupportedPage()) {
  beforeLoadedStyleEl = injectCSS(`
    html.dark.bewly-design {
      background-color: hsl(230 12% 6%);
    }

    body {
      pointer-events: none;
      z-index: 0;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      background-color: #d3e9c8;
      width: 100%;
      height: 100vh;
      top: 0;
    }

    #i_cecream {
      opacity: 1;
      pointer-events: none;
    }

    #app {
      opacity: 0 !important;
    }
  `)
}

if (isFirefox) {
  let isFirstScriptExecute = true
  document.addEventListener('beforescriptexecute', () => {
    if (!isFirstScriptExecute)
      return

    injectApp()
    isFirstScriptExecute = false
  })
}
else {
  document.addEventListener('DOMContentLoaded', () => {
    if(isHomePage()) {
      injectApp()
    } else {
      runWhenIdle(injectApp)
    }
  })
}

function injectApp() {
  const currentUrl = document.URL

  if (isSupportedPage()) {
    if (
      !settings.value.useOriginalBilibiliHomepage
      && (
        /https?:\/\/bilibili.com\/?$/.test(currentUrl)
        || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
        || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
        || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
        || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl)
      )
    ) {
      const originalPageContent = document.querySelector<HTMLDivElement>('#i_cecream')
      if (originalPageContent) {
        originalPageContent.remove()
      }
    }

    // mount component to context window
    const container = document.createElement('div')
    container.id = 'i_cecream'
    const root = document.createElement('div')
    root.id = 'bewly'
    const styleEl = document.createElement('link')
    const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    container.style.opacity = '0'
    container.style.transition = 'opacity .3s ease-in'
    container.addEventListener('transitionend', () => {
      runWhenIdle(() => {
        beforeLoadedStyleEl.remove()
      })
    })
    styleEl.onload = () => {
      container.style.opacity = '1'
    }

    const newStyleEl = document.createElement('link')
    newStyleEl.setAttribute('rel', 'stylesheet')
    newStyleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    document.documentElement.appendChild(newStyleEl)

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
