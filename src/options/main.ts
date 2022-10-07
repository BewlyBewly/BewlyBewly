import { createApp } from 'vue'
import App from './Options.vue'
// import App from './views/App.vue'
// import { router } from '~/contentScripts/router'
// import { i18n } from '~/utils'

import '../styles'

const app = createApp(App)
app.mount('#app')
