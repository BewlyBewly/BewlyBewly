<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import 'overlayscrollbars/overlayscrollbars.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import type { Ref } from '@vue/runtime-dom'
import type { OverlayScrollbars } from 'overlayscrollbars-vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import Anime from './Anime/Anime.vue'
import History from './History/History.vue'
import WatchLater from './WatchLater/WatchLater.vue'
import Favorites from './Favorites/Favorites.vue'
import { accessKey, settings } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { getUserID, hexToRGBA, smoothScrollToTop } from '~/utils/main'
import emitter from '~/utils/mitt'

provide('handleBackToTop', handleBackToTop)

const activatedPage = ref<AppPage>(settings.value.startupPage ?? AppPage.Home)
const { locale } = useI18n()
const [showSettings, toggleSettings] = useToggle(false)
const pages = { Home, Search, Anime, History, WatchLater, Favorites }
const mainAppRef = ref<HTMLElement>() as Ref<HTMLElement>
const scrollbarRef = ref<OverlayScrollbars | null>()
const mainAppOpacity = ref<number>(0)
const showTopbarMask = ref<boolean>(false)
const dynamicComponentKey = ref<string>(`dynamicComponent${Number(new Date())}`)

const isHomePage = computed(() => {
  if (
    /https?:\/\/bilibili.com\/?$/.test(location.href)
  || /https?:\/\/www.bilibili.com\/?$/.test(location.href)
  || /https?:\/\/www.bilibili.com\/index.html$/.test(location.href)
  || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(location.href)
  || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(location.href)
  )
    return true
  return false
})

const isVideoPage = computed(() => {
  if (/https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href))
    return true
  return false
})

const isTopbarFixed = computed(() => {
  if (
    // home page
    /https?:\/\/bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(location.href)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(location.href)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(location.href)

    // // search page
    // || /https?:\/\/search.bilibili.com\/.*$/.test(location.href)
    // video page
    || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href)
    // anime playback & movie page
    || /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(location.href)
    // moment page
    || /https?:\/\/t.bilibili.com.*/.test(location.href)
  )
    return true
  return false
})

watch(
  () => activatedPage.value,
  () => {
    setTimeout(() => {
      mainAppRef.value.scrollTop = 0
    }, 500)
  },
)

watch(
  () => settings.value.themeColor,
  () => {
    setAppThemeColor()
  },
)

// Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
// to prevent some Unocss dark-specific styles from failing to take effect
watch(() => settings.value.theme, () => {
  setAppAppearance()
})

watch(() => settings.value.language, () => {
  setAppLanguage()
})

watch(() => accessKey.value, () => {
  handleChangeAccessKey()
})

watch(() => settings.value.adaptToOtherPageStyles, () => {
  handleAdaptToOtherPageStylesChange()
})

onMounted(() => {
  // nextTick(() => {
  //   setTimeout(() => {
  //     mainAppOpacity.value = 1
  //   }, 1200)
  // })

  if (isHomePage.value) {
    // Force overwrite Bilibili Evolved body tag & html tag background color
    document.body.style.setProperty('background-color', 'unset', 'important')
  }
  document.documentElement.style.setProperty('font-size', '14px')

  document.addEventListener('scroll', () => {
    if (window.scrollY > 0)
      showTopbarMask.value = true
    else showTopbarMask.value = false
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setAppAppearance)

  handleChangeAccessKey()
  setAppAppearance()
  setAppLanguage()
  setAppThemeColor()
  handleAdaptToOtherPageStylesChange()
})

function handleChangeAccessKey() {
  // Clear accessKey if not logged in
  if (!getUserID())
    accessKey.value = ''
}

function changeActivatePage(pageName: AppPage) {
  if (activatedPage.value === pageName) {
    if (activatedPage.value !== AppPage.Search) {
      if (mainAppRef.value.scrollTop === 0)
        handleRefresh()
      else
        handleBackToTop()
    }
    return
  }
  activatedPage.value = pageName
}

async function setAppLanguage() {
  // if there is first-time load extension, set the default language by browser display language
  if (!settings.value.language) {
    if (browser.i18n.getUILanguage() === 'zh-CN') {
      settings.value.language = LanguageType.Mandarin_CN
    }
    else if (browser.i18n.getUILanguage() === 'zh-TW') {
      // Since getUILanguage() cannot get the zh-HK language code
      // use getAcceptLanguages() to get the language code
      const languages: string[] = await browser.i18n.getAcceptLanguages()
      if (languages.includes('zh-HK'))
        settings.value.language = LanguageType.Cantonese
      else settings.value.language = LanguageType.Mandarin_TW
    }
    else {
      settings.value.language = LanguageType.English
    }
  }

  locale.value = settings.value.language
}

/**
 * Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
 * to prevent some Unocss dark-specific styles from failing to take effect
 */
function setAppAppearance() {
  const currentColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (settings.value.theme === 'dark') {
    mainAppRef.value?.classList.add('dark')
    document.querySelector('#bewly')?.classList.add('dark')
    document.documentElement.classList.add('dark')
  }
  else if (settings.value.theme === 'light') {
    mainAppRef.value?.classList.remove('dark')
    document.querySelector('#bewly')?.classList.remove('dark')
    document.documentElement.classList.remove('dark')
  }
  else if (settings.value.theme === 'auto') {
    if (currentColorScheme) {
      mainAppRef.value?.classList.add('dark')
      document.querySelector('#bewly')?.classList.add('dark')
      document.documentElement.classList.add('dark')
    }
    else {
      mainAppRef.value?.classList.remove('dark')
      document.querySelector('#bewly')?.classList.remove('dark')
      document.documentElement.classList.remove('dark')
    }
  }
}

function setAppThemeColor() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (bewlyElement) {
    bewlyElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
    for (let i = 0; i < 9; i++)
      bewlyElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(settings.value.themeColor, i * 0.1 + 0.1))
  }

  document.documentElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
  for (let i = 0; i < 9; i++)
    document.documentElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(settings.value.themeColor, i * 0.1 + 0.1))
}

function handleRefresh() {
  emitter.emit('pageRefresh')
  if (activatedPage.value === AppPage.Anime)
    dynamicComponentKey.value = `dynamicComponent${Number(new Date())}`
}

function handleBackToTop() {
  const osInstance = scrollbarRef.value?.osInstance()

  smoothScrollToTop(osInstance.elements().viewport, 300)
}

function handleAdaptToOtherPageStylesChange() {
  if (settings.value.adaptToOtherPageStyles)
    document.documentElement.classList.add('bewly-design')
  else
    document.documentElement.classList.remove('bewly-design')
}

function handleOsScroll() {
  const osInstance = scrollbarRef.value?.osInstance()
  const { viewport } = osInstance.elements()
  const { scrollTop, scrollHeight, clientHeight } = viewport // get scroll offset

  if (scrollTop === 0)
    showTopbarMask.value = false
  else
    showTopbarMask.value = true

  if (clientHeight + scrollTop >= scrollHeight - 20)
    emitter.emit('reachBottom')
}
</script>

<template>
  <template v-if="isHomePage">
    <AppBackground :activated-page="activatedPage" />
  </template>

  <div
    ref="mainAppRef" class="bewly-wrapper" text="$bew-text-1" transition="opacity duration-300" overflow-y-hidden z-60
    :style="{ opacity: 1, height: isHomePage ? '100vh' : '0' }"
  >
    <!-- Dock & RightSideButtons -->
    <div :style="{ opacity: showSettings ? 0.4 : 1 }">
      <Dock v-if="isHomePage" :activated-page="activatedPage" @change-page="pageName => changeActivatePage(pageName)" @settings-visibility-change="toggleSettings" />
      <RightSideButtons v-else @settings-visibility-change="toggleSettings" />
    </div>

    <!-- Topbar -->
    <div m-auto max-w="$bew-page-max-width" :style="{ opacity: showSettings ? 0.4 : 1 }">
      <Transition name="topbar">
        <Topbar
          v-if="settings.isShowTopbar && !isHomePage"
          :show-topbar-mask="showTopbarMask && isTopbarFixed"
          pos="top-0 left-0" z-9999 w-full
          :style="{ position: isTopbarFixed ? 'fixed' : 'absolute' }"
        />
        <Topbar
          v-else-if="settings.isShowTopbar && isHomePage"
          :show-search-bar="showTopbarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage && activatedPage !== AppPage.Search || activatedPage !== AppPage.Home && activatedPage !== AppPage.Search)"
          :show-logo="showTopbarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage || activatedPage !== AppPage.Home)"
          :show-topbar-mask="showTopbarMask && isTopbarFixed"
          pos="fixed top-0 left-0" z-9999 w-full
        />
      </Transition>
    </div>

    <!-- Settings -->
    <KeepAlive>
      <Settings v-if="showSettings" @close="showSettings = false" />
    </KeepAlive>

    <OverlayScrollbarsComponent ref="scrollbarRef" element="div" h-inherit defer @os-scroll="handleOsScroll">
      <div m-auto max-w="$bew-page-max-width" :style="{ opacity: showSettings ? 0.4 : 1 }">
        <div flex="~" max-w="$bew-page-max-width">
          <main
            v-if="isHomePage"
            p="t-80px" m-auto
            :w="isVideoPage ? '[calc(100%-160px)]' : 'lg:85% md:[calc(90%-60px)] [calc(100%-140px)]'"
          >
            <!-- control button group -->
            <BackToTopAndRefreshButtons
              v-if="activatedPage !== AppPage.Search" :show-refresh-button="!showTopbarMask"
              @refresh="handleRefresh"
              @back-to-top="handleBackToTop"
            />

            <Transition name="page-fade">
              <Component :is="pages[activatedPage]" :key="dynamicComponentKey" />
            </Transition>
          </main>
        </div>
      </div>
    </OverlayScrollbarsComponent>
  </div>
</template>

<style lang="scss" scoped>
.topbar-enter-active,
.topbar-leave-active {
  transition: all 0.5s ease;
}

.topbar-enter-from,
.topbar-leave-to {
  --at-apply: opacity-0 transform -translate-y-full;
}
</style>
