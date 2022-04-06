import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

export const i18n = createI18n({
  legacy: false,
  locale: 'jyut',
  globalInjection: true,
  messages,
})
