import { useI18n } from 'vue-i18n'

import { LanguageType } from '~/enums/appEnums'
import { accessKey, settings } from '~/logic'
import { getUserID, injectCSS } from '~/utils/main'

export function setupNecessarySettingsWatchers() {
  const { locale } = useI18n()

  watch(
    () => settings.value.language,
    async () => {
      // if there is first-time load extension, set the default language by browser display language
      if (!settings.value.language) {
        if (browser.i18n.getUILanguage() === 'zh-CN') {
          settings.value.language = LanguageType.Mandarin_CN
        }
        else if (browser.i18n.getUILanguage() === 'zh-TW') {
          // Since getUILanguage() cannot get the zh-HK language code
          // use getAcceptLanguages() to get the language code
          const languages: string[] = await browser.i18n.getAcceptLanguages()
          if (languages.includes('zh-HK')) {
            settings.value.language = LanguageType.Cantonese
          }
          else {
            settings.value.language = LanguageType.Mandarin_TW
          }
        }
        else {
          settings.value.language = LanguageType.English
        }
      }

      locale.value = settings.value.language

      if (locale.value === LanguageType.Mandarin_CN) {
        document.documentElement.lang = 'zh-CN'
      }
      else if (locale.value === LanguageType.Mandarin_TW) {
        document.documentElement.lang = 'zh-TW'
      }
      else if (locale.value === LanguageType.Cantonese) {
        document.documentElement.lang = 'zh-HK'
      }
      else {
        document.documentElement.lang = 'en'
      }
    },
    { immediate: true },
  )

  watch(
    [() => settings.value.customizeFont, () => settings.value.fontFamily],
    () => {
      // Set the default font family
      if (!settings.value.customizeFont && !settings.value.fontFamily) {
        settings.value.fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Roboto Flex", "Noto Sans", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Arial, sans-serif`
      }

      if (settings.value.customizeFont) {
        document.documentElement.style.setProperty('--bew-font-family', settings.value.fontFamily)
      }
      else {
        document.documentElement.style.removeProperty('--bew-font-family')
      }
    },
    { immediate: true },
  )

  const removeTheIndentFromChinesePunctuationStyleEl = injectCSS(`
    .video-info-container .special-text-indent[data-title^='《'],
    .video-info-container .special-text-indent[data-title^='「'],
    .video-info-container .special-text-indent[data-title^='『'], 
    .video-info-container .special-text-indent[data-title^='【'],
    p[title^='\\300c'],
    p[title^='\\300e'],
    p[title^='\\3010'],
    h3[title^='\\300c'],
    h3[title^='\\300e'],
    h3[title^='\\3010'] {
      text-indent: 0 !important;
    }
  `)
  watch(
    () => settings.value.removeTheIndentFromChinesePunctuation,
    () => {
      if (settings.value.removeTheIndentFromChinesePunctuation) {
        document.documentElement.appendChild(removeTheIndentFromChinesePunctuationStyleEl)
      }
      else {
        document.documentElement.removeChild(removeTheIndentFromChinesePunctuationStyleEl)
      }
    },
    { immediate: true },
  )

  watch(
    () => settings.value.disableFrostedGlass,
    () => {
      const bewlyElement = document.querySelector('#bewly') as HTMLElement
      if (settings.value.disableFrostedGlass) {
        if (bewlyElement)
          bewlyElement.classList.add('disable-frosted-glass')

        document.documentElement.classList.add('disable-frosted-glass')

        settings.value.reduceFrostedGlassBlur = false
      }
      else {
        if (bewlyElement)
          bewlyElement.classList.remove('disable-frosted-glass')

        document.documentElement.classList.remove('disable-frosted-glass')
      }
    },
    { immediate: true },
  )

  watch(
    () => settings.value.reduceFrostedGlassBlur,
    () => {
      const bewlyElement = document.querySelector('#bewly') as HTMLElement
      if (settings.value.reduceFrostedGlassBlur) {
        if (bewlyElement)
          bewlyElement.classList.add('reduce-frosted-glass-blur')

        document.documentElement.classList.add('reduce-frosted-glass-blur')
      }
      else {
        if (bewlyElement)
          bewlyElement.classList.remove('reduce-frosted-glass-blur')

        document.documentElement.classList.remove('reduce-frosted-glass-blur')
      }
    },
    { immediate: true },
  )

  watch(() => settings.value.blockAds, () => {
    // Do not use the "ads" keyword. AdGuard, AdBlock, and some ad-blocking extensions will
    // detect and remove it when the class name contains "ads"
    if (settings.value.blockAds)
      document.documentElement.classList.add('block-useless-contents')
    else
      document.documentElement.classList.remove('block-useless-contents')
  }, { immediate: true })

  watch(
    () => settings.value.themeColor,
    () => {
      const bewlyElement = document.querySelector('#bewly') as HTMLElement
      if (bewlyElement) {
        bewlyElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
      }

      document.documentElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
    },
    { immediate: true },
  )

  let styleEL: HTMLStyleElement | null = null
  let bewlyStyleEL: HTMLStyleElement | null = null
  watch(
    [() => settings.value.customizeCSS, () => settings.value.customizeCSSContent],
    () => {
      const bewlyEl: HTMLElement | null = document.querySelector('#bewly')
      const bewlyShadow: ShadowRoot | null = bewlyEl?.shadowRoot || null

      if (settings.value.customizeCSS) {
        styleEL = injectCSS(settings.value.customizeCSSContent)

        if (bewlyShadow)
          bewlyStyleEL = injectCSS(settings.value.customizeCSSContent, bewlyShadow)
      }
      else {
        if (styleEL)
          document.documentElement.removeChild(styleEL)

        if (bewlyShadow && bewlyStyleEL)
          bewlyShadow.removeChild(bewlyStyleEL)
      }
    },
    { immediate: true },
  )

  watch(
    () => accessKey.value,
    () => {
      // Clear accessKey if not logged in
      if (!getUserID())
        accessKey.value = ''
    },
    { immediate: true },
  )

  watch(
    () => settings.value.showTopBar,
    (newVal) => {
      if (newVal)
        settings.value.useOriginalBilibiliTopBar = false
    },
    { immediate: true },
  )

  watch(
    () => settings.value.useOriginalBilibiliTopBar,
    (newVal) => {
      if (newVal)
        settings.value.showTopBar = false
      document.documentElement.classList.toggle('remove-bili-top-bar', !settings.value.useOriginalBilibiliTopBar)
    },
    { immediate: true },
  )

  watch(
    () => settings.value.adaptToOtherPageStyles,
    () => {
      if (settings.value.adaptToOtherPageStyles)
        document.documentElement.classList.add('bewly-design')
      else
        document.documentElement.classList.remove('bewly-design')
    },
    { immediate: true },
  )
}
