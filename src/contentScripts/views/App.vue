<script setup lang="ts">
import { useThrottleFn, useToggle } from '@vueuse/core'
import type { Ref } from 'vue'

import type { BewlyAppProvider } from '~/composables/useAppProvider'
import { useDark } from '~/composables/useDark'
import { BEWLY_MOUNTED, DRAWER_VIDEO_ENTER_PAGE_FULL, DRAWER_VIDEO_EXIT_PAGE_FULL, OVERLAY_SCROLL_BAR_SCROLL } from '~/constants/globalEvents'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import { isHomePage, openLinkToNewTab, queryDomUntilFound, scrollToTop } from '~/utils/main'
import emitter from '~/utils/mitt'

import { setupNecessarySettingsWatchers } from './necessarySettingsWatchers'

const { isDark } = useDark()
const [showSettings, toggleSettings] = useToggle(false)

// Get the 'page' query parameter from the URL
function getPageParam(): AppPage | null {
  const urlParams = new URLSearchParams(window.location.search)
  const result = urlParams.get('page') as AppPage | null
  if (result && Object.values(AppPage).includes(result))
    return result
  return null
}

const activatedPage = ref<AppPage>(getPageParam() || (settings.value.dockItemVisibilityList.find(e => e.visible === true)?.page || AppPage.Home))
const pages = {
  [AppPage.Home]: defineAsyncComponent(() => import('./Home/Home.vue')),
  [AppPage.Search]: defineAsyncComponent(() => import('./Search/Search.vue')),
  [AppPage.Anime]: defineAsyncComponent(() => import('./Anime/Anime.vue')),
  [AppPage.FeedYou]: defineAsyncComponent(() => import('./FeedYou/FeedYou.vue')),
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
  if (inIframe.value) {
    return false
  }
  else {
    return isHomePage() && !inIframe.value && !settings.value.useOriginalBilibiliHomepage
  }
})

watch(
  () => activatedPage.value,
  () => {
    // Update the URL query parameter when activatedPage changes
    const url = new URL(window.location.href)
    url.searchParams.set('page', activatedPage.value)
    window.history.replaceState({}, '', url.toString())
    const osInstance = scrollbarRef.value.osInstance()
    osInstance.elements().viewport.scrollTop = 0
  },
)

// Setup necessary settings watchers
setupNecessarySettingsWatchers()

onMounted(() => {
  window.dispatchEvent(new CustomEvent(BEWLY_MOUNTED))

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
})

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

function handleBackToTop(targetScrollTop = 0 as number) {
  const osInstance = scrollbarRef.value?.osInstance()

  scrollToTop(osInstance.elements().viewport, targetScrollTop)
  topBarRef.value?.toggleTopBarVisible(true)
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

function openIframeDrawer(url: string) {
  const isSameOrigin = (origin: URL, destination: URL) =>
    origin.protocol === destination.protocol && origin.host === destination.host && origin.port === destination.port

  const currentUrl = new URL(location.href)
  const destination = new URL(url)

  if (!isSameOrigin(currentUrl, destination)) {
    openLinkToNewTab(url)
    return
  }

  iframeDrawerUrl.value = url
  showIframeDrawer.value = true
}

// In drawer video, watch btn className changed and post message to parent
watchEffect(async (onCleanUp) => {
  if (!inIframe.value)
    return null

  const observer = new MutationObserver(([{ target: el }]) => {
    if (!(el instanceof HTMLElement))
      return null
    if (el.classList.contains('bpx-state-entered')) {
      parent.postMessage(DRAWER_VIDEO_ENTER_PAGE_FULL)
    }
    else {
      parent.postMessage(DRAWER_VIDEO_EXIT_PAGE_FULL)
    }
  })

  const abort = new AbortController()
  queryDomUntilFound('.bpx-player-ctrl-btn.bpx-player-ctrl-web', 500, abort).then((openVideo2WebFullBtn) => {
    if (!openVideo2WebFullBtn)
      return
    observer.observe(openVideo2WebFullBtn, { attributes: true })
  })

  onCleanUp(() => {
    observer.disconnect()
    abort.abort()
  })
})

/**
 * Checks if the current viewport has a scrollbar.
 * @returns {boolean} Returns true if the viewport has a scrollbar, false otherwise.
 */
async function haveScrollbar() {
  await nextTick()
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
      <SideBar
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
              w="lg:[calc(100%-200px)] [calc(100%-150px)]"
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
      v-if="showIframeDrawer"
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
