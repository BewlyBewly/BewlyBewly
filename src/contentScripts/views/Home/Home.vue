<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ForYou from './components/ForYou.vue'
import Following from './components/Following.vue'
import Trending from './components/Trending.vue'
import Ranking from './components/Ranking.vue'
import SubscribedSeries from './components/SubscribedSeries.vue'
import type { HomeTab } from './types'
import { HomeSubPage } from './types'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'

const { t } = useI18n()

const handleBackToTop = inject('handleBackToTop') as (targetScrollTop: number) => void

const recommendContentKey = ref<string>(`recommendContent${Number(new Date())}`)
const activatedPage = ref<HomeSubPage>(HomeSubPage.ForYou)
const pages = { ForYou, Following, SubscribedSeries, Trending, Ranking }
const showSearchPageMode = ref<boolean>(false)
const shouldMoveTabsUp = ref<boolean>(false)

const tabs = computed((): HomeTab[] => {
  return [
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
})

watch(() => activatedPage.value, () => {
  handleBackToTop(settings.value.useSearchPageModeOnHomePage ? 510 : 0)
})

onMounted(() => {
  showSearchPageMode.value = true
  emitter.off('pageRefresh')
  emitter.on('pageRefresh', async () => {
    recommendContentKey.value = `recommendContent${Number(new Date())}`
  })
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
})

onUnmounted(() => {
  emitter.off('pageRefresh')
  emitter.off('topBarVisibleChange')
})
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
        <transition name="fade">
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
        </transition>
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
            :class="{ 'tab-activated': activatedPage === tab.value }"
            @click="activatedPage = tab.value"
          >
            <span class="text-center">{{ tab.label }}</span>
          </li>
        </ul>
      </header>

      <Transition name="page-fade">
        <Component :is="pages[activatedPage]" :key="recommendContentKey" />
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
