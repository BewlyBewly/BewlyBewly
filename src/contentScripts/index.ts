import 'uno.css'
import '~/styles'

import { createApp } from 'vue'

import { useDark } from '~/composables/useDark'
import { settings } from '~/logic'
import { setupApp } from '~/logic/common-setup'
import { runWhenIdle } from '~/utils/lazyLoad'
import { injectCSS, isHomePage } from '~/utils/main'
import { SVG_ICONS } from '~/utils/svgIcons'

import App from './views/App.vue'

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
    isHomePage()
    // fix #166 https://github.com/hakadao/BewlyBewly/issues/166
    || /https?:\/\/www\.bilibili\.com\/\?bvid=.*$/.test(currentUrl)

    // video page
    || /https?:\/\/(?:www\.)?bilibili\.com\/(?:video|list)\/.*/.test(currentUrl)
    // anime playback & movie page
    || /https?:\/\/(?:www\.)?bilibili\.com\/bangumi\/play\/.*/.test(currentUrl)
    // watch later playlist
    || /https?:\/\/(?:www\.)?bilibili\.com\/list\/watchlater.*/.test(currentUrl)
    // favorite playlist
    || /https?:\/\/(?:www\.)?bilibili\.com\/list\/ml.*/.test(currentUrl)
    // search page
    || /https?:\/\/search\.bilibili\.com\.*/.test(currentUrl)
    // moments
    || /https?:\/\/t\.bilibili\.com\.*/.test(currentUrl)
    // moment detail
    || /https?:\/\/(?:www\.)?bilibili\.com\/opus\/.*/.test(currentUrl)
    // history page
    || /https?:\/\/(?:www\.)?bilibili\.com\/account\/history.*/.test(currentUrl)
    // watcher later page
    || /https?:\/\/(?:www\.)?bilibili\.com\/watchlater\/#\/list.*/.test(currentUrl)
    // user space page
    || /https?:\/\/space\.bilibili\.com\.*/.test(currentUrl)
    // notifications page
    || /https?:\/\/message\.bilibili\.com\.*/.test(currentUrl)
    // bilibili channel page b站分区页面
    || /https?:\/\/(?:www\.)?bilibili\.com\/v\/(?!popular).*/.test(currentUrl)
    // anime page & chinese anime page
    || /https?:\/\/(?:www\.)?bilibili\.com\/(?:anime|guochuang).*/.test(currentUrl)
    // channel page e.g. tv shows, movie, variety shows, mooc page
    || /https?:\/\/(?:www\.)?bilibili\.com\/(?:tv|movie|variety|mooc|documentary).*/.test(currentUrl)
    // article page
    // www.bilibili.com/read/pcpreview 是专栏浏览页, 因布局问题不做适配 #846
    || /https?:\/\/(?:www\.)?bilibili\.com\/read\/(?!pcpreview).*/.test(currentUrl)
    // 404 page
    || /^https?:\/\/(?:www\.)?bilibili\.com\/404.*$/.test(currentUrl)
    // creative center page 創作中心頁
    || /^https?:\/\/member\.bilibili\.com\/platform.*$/.test(currentUrl)
    // account settings page 帳號設定頁
    || /^https?:\/\/account\.bilibili\.com\/.*$/.test(currentUrl)
    // login page
    || /^https?:\/\/passport\.bilibili\.com\/login.*$/.test(currentUrl)
  ) {
    return true
  }
  else {
    return false
  }
}

let beforeLoadedStyleEl: HTMLStyleElement | undefined

if (isSupportedPages()) {
  if (settings.value.adaptToOtherPageStyles)
    useDark()

  if (settings.value.adaptToOtherPageStyles)
    document.documentElement.classList.add('bewly-design')
  else
    document.documentElement.classList.remove('bewly-design')
}

if (settings.value.adaptToOtherPageStyles && isHomePage()) {
  beforeLoadedStyleEl = injectCSS(`
    html.bewly-design {
      background-color: var(--bew-bg);
      transition: background-color 0.2s ease-in;
    }

    body {
      display: none;
    }
  `)

  // Add opacity transition effect for page loaded
  injectCSS(`
    body {
      transition: opacity 0.5s;
    }
  `)
}

if (isSupportedPages()) {
  // remove the original top bar and adjust the height of the top bar to match the bewly top bar
  injectCSS(`
    .bili-header .bili-header__bar,
    #internationalHeader,
    .link-navbar,
    #home_nav,
    #biliMainHeader,
    #bili-header-container {
      visibility: hidden;
      height: var(--bew-top-bar-height) !important;
    }

    /* some pages have a white bar at the top; changing the top margin fixes this problem */
    .banner-wrapper,
    .home-banner-wrapper {
      margin-top: calc(-1 * var(--bew-top-bar-height)) !important;
    }
  `)
}

function onDOMLoaded() {
  // Remove the original Bilibili homepage if in Bilibili homepage & useOriginalBilibiliHomepage is enabled
  if (!settings.value.useOriginalBilibiliHomepage && isHomePage()) {
    // const originalPageContent = document.querySelector('#i_cecream')
    // if (originalPageContent)
    //   originalPageContent.innerHTML = ''
    document.body.innerHTML = ''
  }
  if (beforeLoadedStyleEl)
    document.documentElement.removeChild(beforeLoadedStyleEl)

  if (isSupportedPages()) {
    // Then inject the app
    injectApp()
  }
}

if (document.readyState !== 'loading')
  onDOMLoaded()
else
  document.addEventListener('DOMContentLoaded', () => onDOMLoaded())

function injectApp() {
  // Inject app when idle
  runWhenIdle(async () => {
  // mount component to context window
    const container = document.createElement('div')
    container.id = 'bewly'
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    // Fix #69 https://github.com/hakadao/BewlyBewly/issues/69
    // https://medium.com/@emilio_martinez/shadow-dom-open-vs-closed-1a8cf286088a - open shadow dom
    const shadowDOM = container.attachShadow?.({ mode: 'open' }) || container
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
    setupApp(app)
    app.mount(root)
  })
}
