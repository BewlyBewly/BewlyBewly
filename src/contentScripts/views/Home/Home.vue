<script setup lang="ts">
import ForYou from './components/ForYou.vue'
import Following from './components/Following.vue'
import Trending from './components/Trending.vue'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'

const handleBackToTop = inject('handleBackToTop') as () => void

const recommendContentKey = ref<string>(`recommendContent${Number(new Date())}`)
const activatedPage = ref<'ForYou' | 'Following' | 'Trending'>('ForYou')
const pages = { ForYou, Following, Trending }

const tabs = reactive<{ label: string; value: 'ForYou' | 'Following' | 'Trending' }[]>([
  {
    label: 'For you',
    value: 'ForYou',
  },
  {
    label: 'Following',
    value: 'Following',
  },
  {
    label: 'Trending',
    value: 'Trending',
  },
])

watch(() => activatedPage.value, () => {
  handleBackToTop()
})

onMounted(() => {
  emitter.off('pageRefresh')
  emitter.on('pageRefresh', async () => {
    recommendContentKey.value = `recommendContent${Number(new Date())}`
  })
})

onUnmounted(() => {
  emitter.off('pageRefresh')
})
</script>

<template>
  <div>
    <!-- Home search page mode background -->
    <div
      v-if="settings.useSearchPageModeOnHomePage && settings.individuallySetSearchPageWallpaper"
    >
      <div
        pos="absolute left-0 top-0" w-full h-580px mb--580px bg="cover center" z-1
        :style="{
          backgroundImage: `url(${settings.searchPageWallpaper})`,
        }"
      />
      <!-- background mask -->
      <transition name="fade">
        <div
          v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (settings.searchPageEnableWallpaperMasking)"
          pos="relative left-0 top-0" w-full h-580px mb--580px pointer-events-none duration-300 z-1 bg="$bew-homepage-bg-mask"
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

    <main>
      <div
        v-if="settings.useSearchPageModeOnHomePage"
        flex="~ col"
        justify-center
        items-center relative
        w-full z-10
        h-500px mb-8
      >
        <!-- h-50vh max-h-550px -->
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
      <header pos="sticky top-70px" z-10 mb-4>
        <ul flex="~ items-center gap-2">
          <li
            v-for="tab in tabs" :key="tab.value"
            px-4 lh-35px bg="$bew-elevated-1 hover:$bew-elevated-1-hover" backdrop-glass rounded="$bew-radius"
            cursor-pointer shadow="$bew-shadow-1" box-border border="1 $bew-border-color" duration-300
            :class="{ 'tab-activated': activatedPage === tab.value }"
            @click="activatedPage = tab.value"
          >
            {{ tab.label }}
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
.tab-activated {
  --at-apply: bg-$bew-theme-color dark:bg-white color-white dark:color-black
    border-$bew-theme-color dark:border-white;
}
</style>
