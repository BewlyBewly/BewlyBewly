import { createApp } from 'vue'

import 'uno.css'
import '~/styles/index.ts'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { SVG_ICONS } from '~/utils/svgIcons'
import { injectCSS } from '~/utils/main'
import { settings } from '~/logic'
import { runWhenIdle } from '~/utils/lazyLoad'

const isFirefox: boolean = /Firefox/i.test(navigator.userAgent)

// Fix `OverlayScrollbars` not working in Firefox
// https://github.com/fingerprintjs/fingerprintjs/issues/683#issuecomment-881210244
if (isFirefox) {
  window.requestIdleCallback = window.requestIdleCallback.bind(window)
  window.cancelIdleCallback = window.cancelIdleCallback.bind(window)
  window.requestAnimationFrame = window.requestAnimationFrame.bind(window)
  window.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
  window.setTimeout = window.setTimeout.bind(window)
  window.clearTimeout = window.clearTimeout.bind(window)
}

const currentUrl = document.URL

function isSupportedPages() {
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
    // anime page & chinese anime page
    || /https?:\/\/www.bilibili.com\/(anime|guochuang).*/.test(currentUrl)
    // channel page e.g. tv shows, movie, variety shows, mooc page
    || /https?:\/\/(www.)?bilibili.com\/(tv|movie|variety|mooc|documentary).*/.test(currentUrl)
    // article page
    || /https?:\/\/(www.)?bilibili.com\/(read).*/.test(currentUrl)
  )
    return true
  else
    return false
}

let beforeLoadedStyleEl: HTMLStyleElement

// Since using runWhenIdle does not instantly inject the app to the page, a style class cannot be injected immediately to the <html> tag
// We have to manually add a class to the <html> app to ensure that the transition effect is applied
if (
  (settings.value.adaptToOtherPageStyles && settings.value.theme === 'dark')
  || (settings.value.adaptToOtherPageStyles && settings.value.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  document.documentElement.classList.add('bewly-design', 'dark')

if (settings.value.adaptToOtherPageStyles && isSupportedPages()) {
  beforeLoadedStyleEl = injectCSS(`
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
}

document.addEventListener('DOMContentLoaded', () => {
  if (isSupportedPages()) {
    // Remove the original Bilibili homepage if in Bilibili homepage & useOriginalBilibiliHomepage is enabled
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
      const originalPageContent = document.querySelector('#i_cecream')
      if (originalPageContent)
        originalPageContent.innerHTML = ''
    }

    // document.documentElement.removeChild(beforeLoadedStyleEl)
    // Then inject the app
    injectApp()
  }
})

function injectApp() {
  // Inject style first
  const newStyleEl = document.createElement('link')
  newStyleEl.setAttribute('rel', 'stylesheet')
  newStyleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  document.documentElement.appendChild(newStyleEl)
  newStyleEl.onload = async () => {
    // To prevent abrupt style transitions caused by sudden style changes
    setTimeout(() => {
      document.documentElement.removeChild(beforeLoadedStyleEl)
    }, 500)
  }

  // Inject app when idle
  runWhenIdle(async () => {
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
      // To prevent abrupt style transitions caused by sudden style changes
      setTimeout(() => {
        container.style.opacity = '1'
      }, 500)
    }

    // inject svg icons
    const svgDiv = document.createElement('div')
    svgDiv.innerHTML = SVG_ICONS
    shadowDOM.appendChild(svgDiv)

    document.body.appendChild(container)

    const app = createApp(App)
    await setupApp(app)
    app.mount(root)
  })
}
