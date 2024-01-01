<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import type { Ref } from '@vue/runtime-dom'

import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import Anime from './Anime/Anime.vue'
import History from './History/History.vue'
import WatchLater from './WatchLater/WatchLater.vue'
import Favorites from './Favorites/Favorites.vue'
import { accessKey, settings } from '~/logic'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { getUserID, hexToRGBA, isHomePage, smoothScrollToTop } from '~/utils/main'
import emitter from '~/utils/mitt'

const activatedPage = ref<AppPage>(settings.value.dockItemVisibilityList.find(e => e.visible === true)?.page ?? AppPage.Home)
const { locale } = useI18n()
const [showSettings, toggleSettings] = useToggle(false)
const pages = { Home, Search, Anime, History, WatchLater, Favorites }
const mainAppRef = ref<HTMLElement>() as Ref<HTMLElement>
const scrollbarRef = ref()
const showTopBarMask = ref<boolean>(false)
const dynamicComponentKey = ref<string>(`dynamicComponent${Number(new Date())}`)
const topBarRef = ref()

const isVideoPage = computed(() => {
  if (/https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href))
    return true
  return false
})

const isSearchPage = computed(() => {
  if (/https?:\/\/search.bilibili.com\/.*$/.test(location.href))
    return true
  return false
})

const isTopBarFixed = computed(() => {
  if (
    isHomePage()
    // // search page
    // || /https?:\/\/search.bilibili.com\/.*$/.test(location.href)
    // video page
    || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href)
    // anime playback & movie page
    || /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(location.href)
    // moment page
    || /https?:\/\/t.bilibili.com.*/.test(location.href)
    // channel, anime, tv shows, movie, variety shows, mooc page
    || /https?:\/\/(www.)?bilibili.com\/(v|anime|tv|movie|variety|mooc).*/.test(location.href)
  )
    return true
  return false
})

watch(
  () => activatedPage.value,
  () => {
    const osInstance = scrollbarRef.value.osInstance()
    osInstance.elements().viewport.scrollTop = 0
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
  if (isHomePage()) {
    // Force overwrite Bilibili Evolved body tag & html tag background color
    document.body.style.setProperty('background-color', 'unset', 'important')
  }
  document.documentElement.style.setProperty('font-size', '14px')

  document.addEventListener('scroll', () => {
    if (window.scrollY > 0)
      showTopBarMask.value = true
    else showTopBarMask.value = false
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
  const osInstance = scrollbarRef.value?.osInstance()
  const scrollTop: number = osInstance.elements().viewport.scrollTop

  if (activatedPage.value === pageName) {
    if (activatedPage.value !== AppPage.Search) {
      if (scrollTop === 0)
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

function handleBackToTop(targetScrollTop = 0 as number) {
  const osInstance = scrollbarRef.value?.osInstance()

  smoothScrollToTop(osInstance.elements().viewport, 300, targetScrollTop)
  topBarRef.value?.toggleTopBarVisible(true)
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
    showTopBarMask.value = false
  else
    showTopBarMask.value = true

  if (clientHeight + scrollTop >= scrollHeight - 20)
    emitter.emit('reachBottom')

  if (isHomePage())
    topBarRef.value?.handleScroll()
}

provide('handleBackToTop', handleBackToTop)
provide('handleRefresh', handleRefresh)
provide('activatedPage', activatedPage)
provide('scrollbarRef', scrollbarRef)
</script>

<template>
  <div ref="mainAppRef" class="bewly-wrapper" text="$bew-text-1">
    <!-- Background -->
    <template v-if="isHomePage() && !settings.useOriginalBilibiliHomepage">
      <AppBackground :activated-page="activatedPage" />
    </template>

    <!-- Settings -->
    <KeepAlive>
      <Settings v-if="showSettings" z-10002 @close="showSettings = false" />
    </KeepAlive>

    <!-- Dock & RightSideButtons -->
    <div pos="absolute top-0 left-0" w-full h-full overflow-hidden>
      <Dock
        v-if="isHomePage() && !settings.useOriginalBilibiliHomepage"
        :activated-page="activatedPage" @change-page="pageName => changeActivatePage(pageName)"
        @settings-visibility-change="toggleSettings"
      />
      <RightSideButtons
        v-else
        @settings-visibility-change="toggleSettings"
      />
    </div>

    <!-- Topbar -->
    <div m-auto max-w="$bew-page-max-width">
      <Transition name="top-bar">
        <TopBar
          v-if="settings.showTopBar && !isHomePage()"
          pos="top-0 left-0" z="99 hover:1001" w-full
          :style="{ position: isTopBarFixed ? 'fixed' : 'absolute' }"
          :show-search-bar="!isSearchPage"
          :mask="showTopBarMask"
        />
        <TopBar
          v-else-if="settings.showTopBar && isHomePage()"
          ref="topBarRef"
          :show-search-bar="showTopBarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage && activatedPage !== AppPage.Search || activatedPage !== AppPage.Home && activatedPage !== AppPage.Search)"
          :show-logo="showTopBarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage || activatedPage !== AppPage.Home)"
          :mask="showTopBarMask"
          pos="fixed top-0 left-0" z="99 hover:1001" w-full
        />
      </Transition>
    </div>

    <div
      pos="absolute top-0 left-0" w-full h-full
      :style="{ height: isHomePage() && !settings.useOriginalBilibiliHomepage ? '100dvh' : '0' }"
    >
      <template v-if="isHomePage() && !settings.useOriginalBilibiliHomepage">
        <OverlayScrollbarsComponent ref="scrollbarRef" element="div" h-inherit defer @os-scroll="handleOsScroll">
          <main m-auto max-w="$bew-page-max-width">
            <div
              p="t-80px" m-auto
              :w="isVideoPage ? '[calc(100%-160px)]' : 'lg:85% md:[calc(90%-60px)] [calc(100%-140px)]'"
            >
              <!-- control button group -->
              <BackToTopAndRefreshButtons
                v-if="activatedPage !== AppPage.Search" :show-refresh-button="!showTopBarMask"
                @refresh="handleRefresh"
                @back-to-top="handleBackToTop"
              />

              <Transition name="page-fade">
                <Component :is="pages[activatedPage]" :key="dynamicComponentKey" />
              </Transition>
            </div>
          </main>
        </OverlayScrollbarsComponent>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-bar-enter-active,
.top-bar-leave-active {
  transition: all 0.5s ease;
}

.top-bar-enter-from,
.top-bar-leave-to {
  --at-apply: opacity-0 transform -translate-y-full;
}
</style>
