import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { SVG_ICONS, getCookie, i18n, setCookie } from '~/utils'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // console.info('[vitesse-webext] Hello world from content script')

  // // communication example: send previous tab title from background page
  // onMessage('tab-prev', ({ data }) => {
  //   console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  // })

  const currentUrl = document.URL

  if (
    /https?:\/\/bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl)
    // || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(currentUrl)
  ) {
    const originalPageContent = document.querySelector('#i_cecream')
    if (originalPageContent)
      originalPageContent.innerHTML = ''

    // const container = document.createElement('div')
    // const root = document.createElement('div')
    // const styleEl = document.createElement('link')
    // styleEl.setAttribute('rel', 'stylesheet')
    // styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    // container.id = 'bewly'
    // container.appendChild(styleEl)
    // container.appendChild(root)
    // document.body.appendChild(container)

    // const app = createApp(App)
    // setupApp(app)
    // app.use(i18n).mount(root)

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
    document.body.appendChild(container)
    const app = createApp(App)
    setupApp(app)
    app.use(i18n).mount(root)

    // inject svg icons
    const svgDiv = document.createElement('div')
    svgDiv.innerHTML = SVG_ICONS
    document.body.appendChild(svgDiv)
  }
})()
