<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { GridLayoutIcon } from './types'
import { HomeSubPage } from './types'
import emitter from '~/utils/mitt'
import { homePageGridLayout, settings } from '~/logic'
import { delay } from '~/utils/main'
import type { HomeTab } from '~/stores/mainStore'
import { useMainStore } from '~/stores/mainStore'

const mainStore = useMainStore()
const { handleBackToTop, scrollbarRef } = useBewlyApp()
const { getBewlyImage } = useBewlyImage()

const activatedPage = ref<HomeSubPage>(HomeSubPage.ForYou)
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
const currentTabs = ref<HomeTab[]>([])
const tabPageRef = ref()

const gridLayoutIcons = computed((): GridLayoutIcon[] => {
  return [
    { icon: 'f7:square-grid-3x2', iconActivated: 'f7:square-grid-3x2-fill', value: 'adaptive' },
    { icon: 'f7:rectangle-grid-2x2', iconActivated: 'f7:rectangle-grid-2x2-fill', value: 'twoColumns' },
    { icon: 'f7:rectangle-grid-1x2', iconActivated: 'f7:rectangle-grid-1x2-fill', value: 'oneColumn' },
  ]
})

// use Json stringify to watch the changes of the array item properties
watch(() => JSON.stringify(settings.value.homePageTabVisibilityList), () => {
  currentTabs.value = computeTabs()
})

function computeTabs(): HomeTab[] {
  // if homePageTabVisibilityList not fresh , set it to default
  if (!settings.value.homePageTabVisibilityList.length || settings.value.homePageTabVisibilityList.length !== mainStore.homeTabs.length)
    settings.value.homePageTabVisibilityList = mainStore.homeTabs.map(tab => ({ page: tab.page, visible: true }))

  const targetTabs: HomeTab[] = []

  for (const tab of settings.value.homePageTabVisibilityList) {
    tab.visible && targetTabs.push({
      i18nKey: (mainStore.homeTabs.find(defaultTab => defaultTab.page === tab.page) || {})?.i18nKey || tab.page,
      page: tab.page,
    })
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
      if (!settings.value.useSearchPageModeOnHomePage) {
        if (val)
          shouldMoveTabsUp.value = false

        else
          shouldMoveTabsUp.value = true
      }
      else {
        // fix #349
        const osInstance = scrollbarRef.value?.osInstance()
        const scrollTop = osInstance.elements().viewport.scrollTop as number

        if (val)
          shouldMoveTabsUp.value = false

        else if (scrollTop > 510 + 40)
          shouldMoveTabsUp.value = true
      }
    }
  })

  currentTabs.value = computeTabs()
  activatedPage.value = currentTabs.value[0].page
})

onUnmounted(() => {
  emitter.off('topBarVisibleChange')
})

function handleChangeTab(tab: HomeTab) {
  if (activatedPage.value === tab.page) {
    const osInstance = scrollbarRef.value?.osInstance()
    const scrollTop = osInstance.elements().viewport.scrollTop as number

    if ((!settings.value.useSearchPageModeOnHomePage && scrollTop > 0) || (settings.value.useSearchPageModeOnHomePage && scrollTop > 510)) {
      handleBackToTop(settings.value.useSearchPageModeOnHomePage ? 510 : 0)
    }
    else {
      if (tabContentLoading.value)
        return
      tabPageRef.value && tabPageRef.value.initData()
    }
    return
  }
  else {
    handleBackToTop(settings.value.useSearchPageModeOnHomePage ? 510 : 0)
  }

  // When the content of a tab is loading, prevent switching to another tab.
  // Since `initPageAction()` within the tab replaces the `handleReachBottom` and `handlePageRefresh` functions.
  // Therefore, this will lead to a failure in refreshing the data of the current tab
  // because `handlePageRefresh` and `handleReachBottom` has been replaced
  // now they are set to refresh the data of the tab you switched to
  if (!tabContentLoading.value)
    activatedPage.value = tab.page
}

function toggleTabContentLoading(loading: boolean) {
  nextTick(async () => {
    // Delay the closing effect to prevent the transition effect from being too stiff
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
            backgroundImage: `url('${getBewlyImage(settings.searchPageWallpaper)}')`,
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
        pos="sticky top-80px" w-full z-9 mb-9 duration-300
        ease-in-out flex="~ justify-between items-start gap-4"
        :class="{ hide: shouldMoveTabsUp }"
      >
        <ul flex="~ items-center gap-3 wrap">
          <li
            v-for="tab in currentTabs" :key="tab.page"
            :class="{ 'tab-activated': activatedPage === tab.page }"
            style="backdrop-filter: var(--bew-filter-glass-1)"
            px-4 lh-35px h-35px bg="$bew-elevated-1 hover:$bew-elevated-1-hover" rounded="$bew-radius"
            cursor-pointer shadow="$bew-shadow-1" box-border border="1 $bew-border-color" duration-300
            flex="~ gap-2 items-center"
            @click="handleChangeTab(tab)"
          >
            <span class="text-center">{{ $t(tab.i18nKey) }}</span>
            <Icon
              :style="{
                opacity: activatedPage === tab.page && tabContentLoading ? 1 : 0,
                margin: activatedPage === tab.page && tabContentLoading ? '0' : '-12px',
              }"
              icon="svg-spinners:ring-resize"
              duration-300 ease-in-out mb--2px text-16px
            />
          </li>
        </ul>

        <div
          style="backdrop-filter: var(--bew-filter-glass-1)"
          flex="~ gap-1 shrink-0" p-1 h-35px bg="$bew-elevated-1"
          rounded="$bew-radius" shadow="$bew-shadow-1" box-border border="1 $bew-border-color"
        >
          <Icon
            v-for="icon in gridLayoutIcons" :key="icon.value"
            :icon="homePageGridLayout === icon.value ? icon.iconActivated : icon.icon"
            :style="{
              backgroundColor: homePageGridLayout === icon.value ? 'var(--bew-theme-color-auto)' : '',
              color: homePageGridLayout === icon.value ? 'var(--bew-text-auto)' : 'unset',
            }"
            w-full
            h-full p="x-2 y-1" rounded="$bew-radius-half" bg="hover:$bew-fill-2" duration-300
            cursor-pointer @click="homePageGridLayout = icon.value"
          />
        </div>
      </header>

      <Transition name="page-fade">
        <KeepAlive include="ForYou">
          <Component
            :is="pages[activatedPage]" :key="activatedPage"
            ref="tabPageRef"
            :grid-layout="homePageGridLayout"
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
  --at-apply: bg-$bew-theme-color-auto text-$bew-text-auto
    border-$bew-theme-color dark:border-white;
}
</style>
