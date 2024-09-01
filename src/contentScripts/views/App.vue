<script setup lang="ts">
import { useThrottleFn, useToggle } from '@vueuse/core'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'

import type { BewlyAppProvider } from '~/composables/useAppProvider'
import { useDark } from '~/composables/useDark'
import { OVERLAY_SCROLL_BAR_SCROLL } from '~/constants/globalEvents'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { accessKey, settings } from '~/logic'
import { getUserID, isHomePage, scrollToTop } from '~/utils/main'
import emitter from '~/utils/mitt'

const { isDark } = useDark()
const { locale } = useI18n()
const [showSettings, toggleSettings] = useToggle(false)

const activatedPage = ref<AppPage>(settings.value.dockItemVisibilityList.find(e => e.visible === true)?.page ?? AppPage.Home)
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
const handlePageRefresh = ref<() => void>()
const handleReachBottom = ref<() => void>()
const handleThrottledPageRefresh = useThrottleFn(() => handlePageRefresh.value?.(), 500)
const handleThrottledReachBottom = useThrottleFn(() => handleReachBottom.value?.(), 500)
const handleThrottledBackToTop = useThrottleFn(() => handleBackToTop(), 1000)
const topBarRef = ref()
const reachTop = ref<boolean>(true)

const iframeDrawerUrl = ref<string>('')
const showIframeDrawer = ref<boolean>(false)

const inIframe = computed((): boolean => {
  return window.self !== window.top
})

const showBewlyPage = computed((): boolean => {
  if (showIframeDrawer.value) {
    return true
  }
  else {
    nextTick(() => {
      return isHomePage() && !inIframe.value && !settings.value.useOriginalBilibiliHomepage
    })
    return true && !inIframe.value
  }
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

watch(() => settings.value.showTopBar, (newVal) => {
  if (newVal)
    settings.value.useOriginalBilibiliTopBar = false
}, { immediate: true })

watch(() => settings.value.useOriginalBilibiliTopBar, (newVal) => {
  if (newVal)
    settings.value.showTopBar = false
  document.documentElement.classList.toggle('remove-bili-top-bar', !settings.value.useOriginalBilibiliTopBar)
}, { immediate: true })

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
      reachTop.value = false
    else
      reachTop.value = true
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
  }

  document.documentElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
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
  emitter.emit(OVERLAY_SCROLL_BAR_SCROLL)

  const osInstance = scrollbarRef.value?.osInstance()
  const { viewport } = osInstance.elements()
  const { scrollTop, scrollHeight, clientHeight } = viewport // get scroll offset

  if (scrollTop === 0) {
    reachTop.value = true
  }
  else {
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

function openIframeDrawer(url: string, _title: string = '') {
  iframeDrawerUrl.value = url
  showIframeDrawer.value = true
}

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
  openIframeDrawer,
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
    <template v-if="showBewlyPage">
      <AppBackground :activated-page="activatedPage" />
    </template>

    <!-- Settings -->
    <KeepAlive>
      <Settings v-if="showSettings" z-10002 @close="showSettings = false" />
    </KeepAlive>

    <!-- Dock & RightSideButtons -->
    <div
      v-if="!inIframe"
      pos="absolute top-0 left-0" w-full h-full overflow-hidden
      pointer-events-none
    >
      <Dock
        v-if="showBewlyPage"
        pointer-events-auto
        :activated-page="activatedPage"
        @change-page="(page: AppPage) => changeActivatePage(page)"
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
    <div v-if="!inIframe" m-auto max-w="$bew-page-max-width">
      <OldTopBar
        v-if="settings.useOldTopBar"
        pos="top-0 left-0" z="99 hover:1001" w-full
      />
      <TopBar
        v-else
        pos="top-0 left-0" z="99 hover:1001" w-full
      />
    </div>

    <div
      pos="absolute top-0 left-0" w-full h-full
      :style="{ height: showBewlyPage ? '100dvh' : '0' }"
    >
      <template v-if="showBewlyPage">
        <OverlayScrollbarsComponent ref="scrollbarRef" element="div" h-inherit defer @os-scroll="handleOsScroll">
          <main m-auto max-w="$bew-page-max-width">
            <div
              p="t-[calc(var(--bew-top-bar-height)+10px)]" m-auto
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

    <IframeDrawer
      v-if="settings.videoCardOpenLinkMode === 'drawer'"
      v-model="showIframeDrawer"
      :url="iframeDrawerUrl"
      @close="showIframeDrawer = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.bewly-wrapper {
  --uno: "text-size-$bew-base-font-size";

  // To fix the filter used in `.bewly-wrapper` that cause the positions of elements become discorded.
  > * > * {
    filter: var(--bew-filter-force-dark);
  }
}
</style>
