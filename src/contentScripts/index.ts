// import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { i18n } from '~/utils/i18n'
import { SVG_ICONS } from '~/utils/svgIcons'

let app: any

const isFirefox: boolean = /Firefox/i.test(navigator.userAgent)

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
    injectApp()
  })
}

function injectApp() {
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

    // inject svg icons
    const svgDiv = document.createElement('div')
    svgDiv.innerHTML = SVG_ICONS
    shadowDOM.appendChild(svgDiv)

    document.body.appendChild(container)
    app = createApp(App)
    setupApp(app)
    app.use(i18n).mount(root)
  }
  else {
    // const originalPageContent = document.querySelector('#i_cecream')
    // if (originalPageContent)
    //   originalPageContent.innerHTML = ''

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

    // inject svg icons
    const svgDiv = document.createElement('div')
    svgDiv.innerHTML = SVG_ICONS
    shadowDOM.appendChild(svgDiv)

    document.body.appendChild(container)
    app = createApp(App)
    setupApp(app)
    app.use(i18n).mount(root)
  }
}

export default app as AppType
