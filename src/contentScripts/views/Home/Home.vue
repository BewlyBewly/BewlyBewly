<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { HomeTab } from './types'
import { HomeSubPage } from './types'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'
import { delay } from '~/utils/main'

const { t } = useI18n()

const { handleBackToTop } = useBewlyApp()

const activatedPage = ref<HomeSubPage>(settings.value.homePageDefaultTab || HomeSubPage.ForYou)
const pages = {
  [HomeSubPage.ForYou]: defineAsyncComponent(() => import('./components/ForYou.vue')),
  [HomeSubPage.Following]: defineAsyncComponent(() => import('./components/Following.vue')),
  [HomeSubPage.SubscribedSeries]: defineAsyncComponent(() => import('./components/SubscribedSeries.vue')),
  [HomeSubPage.Trending]: defineAsyncComponent(() => import('./components/Trending.vue')),
  [HomeSubPage.Ranking]: defineAsyncComponent(() => import('./components/Ranking.vue')),
}
const showSearchPageMode = ref<boolean>(false)
const shouldMoveTabsUp = ref<boolean>(false)
const tabContentLoading = ref<boolean>(false)

const tabs = ref<HomeTab[]>([])

const defaultTabs = [
  {
    label: t('home.for_you'),
    value: HomeSubPage.ForYou,
  },
  {
    label: t('home.following'),
    value: HomeSubPage.Following,
  },
  {
    label: t('home.subscribed_series'),
    value: HomeSubPage.SubscribedSeries,
  },
  {
    label: t('home.trending'),
    value: HomeSubPage.Trending,
  },
  {
    label: t('home.ranking'),
    value: HomeSubPage.Ranking,
  },
]

watch(() => activatedPage.value, () => {
  handleBackToTop(settings.value.useSearchPageModeOnHomePage ? 510 : 0)
})

// use Json stringify to watch the changes of the array item properties
watch(() => JSON.stringify(settings.value.homePageTabVisibilityList), () => {
  tabs.value = computeTabs()
})

function computeTabs() {
  const targetTabs: HomeTab[] = []

  for (const tab of settings.value.homePageTabVisibilityList) {
    tab.visible && targetTabs.push({
      label: (defaultTabs.find(defaultTab => defaultTab.value === tab.page) || {})?.label || tab.page,
      value: tab.page,
    })
  }

  if (!settings.value.homePageTabVisibilityList.length || settings.value.homePageTabVisibilityList.length !== defaultTabs.length) {
    settings.value.homePageTabVisibilityList = defaultTabs.map(tab => ({ page: tab.value, visible: true }))
    return defaultTabs
  }

  return targetTabs
}

onMounted(() => {
  showSearchPageMode.value = true
  emitter.off('topBarVisibleChange')
  emitter.on('topBarVisibleChange', (val) => {
    shouldMoveTabsUp.value = false

    // Allow moving tabs up only when the top bar is not hidden & is set to auto-hide
    // This feature is primarily designed to compatible with the Bilibili Evolved's top bar
    // Even when the BewlyBewly top bar is hidden, the Bilibili Evolved top bar still exists, so not moving up
    if (settings.value.autoHideTopBar && settings.value.showTopBar) {
      if (val)
        shouldMoveTabsUp.value = false

      else
        shouldMoveTabsUp.value = true
    }
  })

  tabs.value = computeTabs()
})

onUnmounted(() => {
  emitter.off('topBarVisibleChange')
})

function handleChangeTab(tab: HomeTab) {
  // When the content of a tab is loading, prevent switching to another tab.
  // Since `initPageAction()` within the tab replaces the `handleReachBottom` and `handlePageRefresh` functions.
  // Therefore, this will lead to a failure in refreshing the data of the current tab
  // because `handlePageRefresh` and `handleReachBottom` has been replaced
  // now they are set to refresh the data of the tab you switched to
  if (!tabContentLoading.value)
    activatedPage.value = tab.value
}

function toggleTabContentLoading(loading: boolean) {
  nextTick(async () => {
    if (!loading)
      await delay(500)
    tabContentLoading.value = loading
  })
}
</script>

<template>
  <div>
    <!-- Home search page mode background -->
    <Transition name="bg">
      <div
        v-if="settings.useSearchPageModeOnHomePage && settings.individuallySetSearchPageWallpaper && showSearchPageMode"
        pos="absolute left-0 top-0" w-full h-580px
      >
        <div
          pos="absolute left-0 top-0" w-full h-inherit bg="cover center" z-1
          pointer-events-none
          :style="{
            backgroundImage: `url(${settings.searchPageWallpaper})`,
            backgroundAttachment: settings.searchPageModeWallpaperFixed ? 'fixed' : 'unset',
          }"
        />
        <!-- background mask -->
        <Transition name="fade">
          <div
            v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (settings.searchPageEnableWallpaperMasking)"
            pos="relative left-0 top-0" w-full h-inherit pointer-events-none duration-300
            z-1
            :style="{
              backdropFilter: `blur(${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaperBlurIntensity : settings.wallpaperBlurIntensity}px)`,
            }"
          >
            <div
              bg="$bew-homepage-bg" pos="absolute top-0 left-0" w-full h-full
              :style="{
                opacity: `${settings.searchPageWallpaperMaskOpacity}%`,
              }"
            />
          </div>
        </Transition>
      </div>
    </Transition>

    <main>
      <!-- Home search page mode content -->
      <Transition name="content">
        <div
          v-if="settings.useSearchPageModeOnHomePage && showSearchPageMode"
          flex="~ col"
          justify-center
          items-center relative
          w-full z-10 mb-4
          h-500px
        >
          <Logo
            v-if="settings.searchPageShowLogo" :size="180" :color="settings.searchPageLogoColor === 'white' ? 'white' : 'var(--bew-theme-color)'"
            :glow="settings.searchPageLogoGlow"
            m="t--70px b-12" z-1
          />
          <SearchBar
            :darken-on-focus="settings.searchPageDarkenOnSearchFocus"
            :blurred-on-focus="settings.searchPageBlurredOnSearchFocus"
            :focused-character="settings.searchPageSearchBarFocusCharacter"
          />
        </div>
      </Transition>

      <header
        pos="sticky top-80px" w-fit z-9 mb-9 duration-300
        ease-in-out
        :class="{ hide: shouldMoveTabsUp }"
      >
        <ul flex="~ items-center gap-3 wrap">
          <li
            v-for="tab in tabs" :key="tab.value"
            px-4 lh-35px bg="$bew-elevated-1 hover:$bew-elevated-1-hover" backdrop-glass rounded="$bew-radius"
            cursor-pointer shadow="$bew-shadow-1" box-border border="1 $bew-border-color" duration-300
            flex="~ gap-2 items-center"
            :class="{ 'tab-activated': activatedPage === tab.value }"
            @click="handleChangeTab(tab)"
          >
            <span class="text-center">{{ tab.label }}</span>
            <Icon
              :style="{
                opacity: activatedPage === tab.value && tabContentLoading ? 1 : 0,
                margin: activatedPage === tab.value && tabContentLoading ? '0' : '-12px',
              }"
              icon="svg-spinners:ring-resize"
              duration-300 ease-in-out mb--2px text-16px
            />
          </li>
        </ul>
      </header>

      <Transition name="page-fade">
        <KeepAlive include="ForYou">
          <Component
            :is="pages[activatedPage]" :key="activatedPage"
            @before-loading="toggleTabContentLoading(true)"
            @after-loading="toggleTabContentLoading(false)"
          />
        </KeepAlive>
      </Transition>
      <!-- <RecommendContent :key="recommendContentKey" /> -->
    </main>
  </div>
</template>

<style scoped lang="scss">
.bg-enter-active,
.bg-leave-active {
  --at-apply: duration-1000 ease-in-out;
}
.bg-enter-from,
.bg-leave-to {
  --at-apply: h-100vh;
}
.bg-leave-to {
  --at-apply: hidden
}

.content-enter-active,
.content-leave-active {
  --at-apply: duration-1000 ease-in-out;
}
.content-enter-from,
.content-leave-to {
  --at-apply: opacity-0 h-100vh;
}
.content-leave-to {
  --at-apply: hidden
}

.hide {
  --at-apply: important-translate-y--70px;
}

.tab-activated {
  --at-apply: bg-$bew-theme-color dark:bg-white color-white dark:color-black
    border-$bew-theme-color dark:border-white;
}
</style>
