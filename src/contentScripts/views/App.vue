<script setup lang="ts">
import { useThrottleFn, useToggle } from '@vueuse/core'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'

import AppBackground from '~/components/AppBackground.vue'
import BackToTopOrRefreshButton from '~/components/BackToTopOrRefreshButton.vue'
import Dock from '~/components/Dock/Dock.vue'
import OverlayScrollbarsComponent from '~/components/OverlayScrollbarsComponent'
import RightSideButtons from '~/components/RightSideButtons/RightSideButtons.vue'
import Settings from '~/components/Settings/Settings.vue'
import TopBar from '~/components/TopBar/TopBar.vue'
import type { BewlyAppProvider } from '~/composables/useAppProvider'
import { useDark } from '~/composables/useDark'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { accessKey, settings } from '~/logic'
import { getUserID, hexToRGBA, isHomePage, scrollToTop } from '~/utils/main'

const { isDark } = useDark()
const activatedPage = ref<AppPage>(settings.value.dockItemVisibilityList.find(e => e.visible === true)?.page ?? AppPage.Home)
const { locale } = useI18n()
const [showSettings, toggleSettings] = useToggle(false)
const pages = {
  [AppPage.Home]: defineAsyncComponent(() => import('./Home/Home.vue')),
  [AppPage.Search]: defineAsyncComponent(() => import('./Search/Search.vue')),
  [AppPage.Anime]: defineAsyncComponent(() => import('./Anime/Anime.vue')),
  [AppPage.History]: defineAsyncComponent(() => import('./History/History.vue')),
  [AppPage.WatchLater]: defineAsyncComponent(() => import('./WatchLater/WatchLater.vue')),
  [AppPage.Favorites]: defineAsyncComponent(() => import('./Favorites/Favorites.vue')),
}
const mainAppRef = ref<HTMLElement>() as Ref<HTMLElement>
const scrollbarRef = ref()
const showTopBarMask = ref<boolean>(false)
const handlePageRefresh = ref<() => void>()
const handleReachBottom = ref<() => void>()
const handleThrottledPageRefresh = useThrottleFn(() => handlePageRefresh.value?.(), 500)
const handleThrottledReachBottom = useThrottleFn(() => handleReachBottom.value?.(), 500)
const handleThrottledBackToTop = useThrottleFn(() => handleBackToTop(), 1000)
const topBarRef = ref()
const reachTop = ref<boolean>(true)

const isSearchPage = computed(() => {
  if (/https?:\/\/search.bilibili.com\/.*$/.test(location.href))
    return true
  return false
})

const isTopBarFixed = computed(() => {
  if (
    isHomePage()
    // video page
    || /https?:\/\/(?:www.)?bilibili.com\/(?:video|list)\/.*/.test(location.href)
    // anime playback & movie page
    || /https?:\/\/(?:www.)?bilibili.com\/bangumi\/play\/.*/.test(location.href)
    // moment page
    || /https?:\/\/t.bilibili.com.*/.test(location.href)
    // channel, anime, chinese anime, tv shows, movie, variety shows, mooc
    || /https?:\/\/(?:www.)?bilibili.com\/(?:v|anime|guochuang|tv|movie|variety|mooc).*/.test(location.href)
    // articles page
    || /https?:\/\/(?:www.)?bilibili.com\/read\/home.*/.test(location.href)
  ) {
    return true
  }
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
  { immediate: true },
)

watch(() => settings.value.language, () => {
  setAppLanguage()
})

watch(() => accessKey.value, () => {
  handleChangeAccessKey()
})

watch(() => settings.value.adaptToOtherPageStyles, () => {
  handleAdaptToOtherPageStylesChange()
}, { immediate: true })

watch(() => settings.value.blockAds, () => {
  handleBlockAds()
})

watch(() => settings.value.disableFrostedGlass, () => {
  handleDisableFrostedGlass()
})

watch(() => settings.value.reduceFrostedGlassBlur, () => {
  handleReduceFrostedGlassBlur()
})

onBeforeMount(() => {
  handleBlockAds()
  handleDisableFrostedGlass()
  handleReduceFrostedGlassBlur()
})

onMounted(() => {
  // openVideoPageIfBvidExists()

  if (isHomePage()) {
    // Force overwrite Bilibili Evolved body tag & html tag background color
    document.body.style.setProperty('background-color', 'unset', 'important')
  }
  // document.documentElement.style.setProperty('font-size', '14px')

  document.addEventListener('scroll', () => {
    if (window.scrollY > 0)
      showTopBarMask.value = true
    else showTopBarMask.value = false
  })

  handleChangeAccessKey()
  setAppLanguage()
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
        handleThrottledPageRefresh()
      else
        handleThrottledBackToTop()
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

function handleBackToTop(targetScrollTop = 0 as number) {
  const osInstance = scrollbarRef.value?.osInstance()

  scrollToTop(osInstance.elements().viewport, targetScrollTop)
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

  if (scrollTop === 0) {
    showTopBarMask.value = false
    reachTop.value = true
  }
  else {
    showTopBarMask.value = true
    reachTop.value = false
  }

  if (clientHeight + scrollTop >= scrollHeight - 300)
    handleThrottledReachBottom()

  if (isHomePage())
    topBarRef.value?.handleScroll()
}

function handleBlockAds() {
  // Do not use the "ads" keyword. AdGuard, AdBlock, and some ad-blocking extensions will
  // detect and remove it when the class name contains "ads"
  if (settings.value.blockAds)
    document.documentElement.classList.add('block-useless-contents')
  else
    document.documentElement.classList.remove('block-useless-contents')
}

function handleDisableFrostedGlass() {
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
}

function handleReduceFrostedGlassBlur() {
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
}

// fix #166 https://github.com/hakadao/BewlyBewly/issues/166
// function openVideoPageIfBvidExists() {
// Assume the URL is https://www.bilibili.com/?bvid=BV1be41127ft&spm_id_from=333.788.seo.out

//   // Get the current URL's query string
//   const queryString = window.location.search
//   // Create a URLSearchParams instance
//   const urlParams = new URLSearchParams(queryString)
//   const bvid = urlParams.get('bvid')

//   if (bvid)
//     window.open(`https://www.bilibili.com/video/${bvid}`, '_self')
// }

/**
 * Checks if the current viewport has a scrollbar.
 * @returns {boolean} Returns true if the viewport has a scrollbar, false otherwise.
 */
function haveScrollbar() {
  const osInstance = scrollbarRef.value?.osInstance()
  const { viewport } = osInstance.elements()
  const { scrollHeight } = viewport // get scroll offset
  return scrollHeight > window.innerHeight
}

provide<BewlyAppProvider>('BEWLY_APP', {
  activatedPage,
  mainAppRef,
  scrollbarRef,
  reachTop,
  handleBackToTop,
  handlePageRefresh,
  handleReachBottom,
  haveScrollbar,
})
</script>

<template>
  <div
    id="bewly-wrapper"
    ref="mainAppRef"
    class="bewly-wrapper"
    :class="{ dark: isDark }"
    text="$bew-text-1"
  >
    <!-- Background -->
    <template v-if="isHomePage() && !settings.useOriginalBilibiliHomepage">
      <AppBackground :activated-page="activatedPage" />
    </template>

    <!-- Settings -->
    <KeepAlive>
      <Settings v-if="showSettings" z-10002 @close="showSettings = false" />
    </KeepAlive>

    <!-- Dock & RightSideButtons -->
    <div pos="absolute top-0 left-0" w-full h-full overflow-hidden pointer-events-none>
      <Dock
        v-if="isHomePage() && !settings.useOriginalBilibiliHomepage"
        pointer-events-auto
        :activated-page="activatedPage"
        @change-page="pageName => changeActivatePage(pageName)"
        @settings-visibility-change="toggleSettings"
        @refresh="handleThrottledPageRefresh"
        @back-to-top="handleThrottledBackToTop"
      />
      <RightSideButtons
        v-else
        pointer-events-auto
        @settings-visibility-change="toggleSettings"
      />
    </div>

    <!-- TopBar -->
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
          :show-search-bar="showTopBarMask && settings.useSearchPageModeOnHomePage
            || (
              !settings.useSearchPageModeOnHomePage && activatedPage !== AppPage.Search
              || activatedPage !== AppPage.Home && activatedPage !== AppPage.Search
            )
            || settings.useOriginalBilibiliHomepage"
          :show-logo="settings.alwaysShowTheTopBarLogoOnSearchPageMode
            || (
              showTopBarMask && settings.useSearchPageModeOnHomePage
              || (!settings.useSearchPageModeOnHomePage || activatedPage !== AppPage.Home)
              || settings.useOriginalBilibiliHomepage
            )"
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
              w="lg:85% md:[calc(90%-60px)] [calc(100%-140px)]"
            >
              <!-- control button group -->
              <BackToTopOrRefreshButton
                v-if="activatedPage !== AppPage.Search && !settings.moveBackToTopOrRefreshButtonToDock"
                @refresh="handleThrottledPageRefresh"
                @back-to-top="handleThrottledBackToTop"
              />

              <Transition name="page-fade">
                <Component :is="pages[activatedPage]" />
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
  --uno: "opacity-0 transform -translate-y-full";
}

.bewly-wrapper {
  --uno: "text-size-$bew-base-font-size";

  // To fix the filter used in `.bewly-wrapper` that cause the positions of elements become discorded.
  > * > * {
    filter: var(--bew-filter-force-dark);
  }
}
</style>
