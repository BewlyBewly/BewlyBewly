<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

import { useDark } from '~/composables/useDark'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import { useMainStore } from '~/stores/mainStore'
import { hexToHSL } from '~/utils/main'

const props = defineProps<{ activatedPage: AppPage }>()

const { isDark } = useDark()
const { getActivatedCover } = useMainStore()

const currentActivatedCover = ref<string>('')
const isBlurredCoverLoaded = ref<boolean>(false)

// Use a more aggressive debounce and skip unnecessary updates
const debouncedCoverUpdate = useDebounceFn((newValue: string) => {
  if (newValue === currentActivatedCover.value)
    return

  const nextCover = newValue

  requestAnimationFrame(() => {
    currentActivatedCover.value = nextCover
    isBlurredCoverLoaded.value = false
  })
}, 800)

// Watch with immediate to handle initial value
watch(
  () => getActivatedCover(),
  debouncedCoverUpdate,
  {
    flush: 'post',
  },
)

const themeColorHsl = computed(() => {
  return hexToHSL(settings.value.themeColor).replace('hsl(', '').replace(')', '')
})
const themeColorHue = computed((): number => {
  return Number(themeColorHsl.value.split(',')[0]) || 0
})
const themeColorSaturation = computed((): number => {
  return Number(themeColorHsl.value.split(',')[1].replace('%', '')) || 0
})
const themeColorLightness = computed((): number => {
  return Number(themeColorHsl.value.split(',')[2].replace('%', '')) || 0
})
const themeColorLinearGradientBackground = computed((): string => {
  return `linear-gradient(180deg, 
    transparent 0% 44%,
    hsla(${themeColorHue.value}, ${themeColorSaturation.value + 20}%, ${themeColorLightness.value}%, 0.4) 62%, 
    hsl(${themeColorHue.value}, ${themeColorSaturation.value}%, ${themeColorLightness.value}%) 80%,
    hsl(${themeColorHue.value}, ${themeColorSaturation.value}%, 100%) 100%)`
})

watch(() => settings.value.wallpaperMaskOpacity, () => {
  setAppWallpaperMaskingOpacity()
})

watch(() => settings.value.searchPageWallpaperMaskOpacity, () => {
  setAppWallpaperMaskingOpacity()
})

watch(() => props.activatedPage, (newValue, oldValue) => {
  // If u have set the `individuallySetSearchPageWallpaper`, reapply the wallpaper when the new page is search page
  // or when switching from a search page to another page, since search page has its own wallpaper.
  if (settings.value.individuallySetSearchPageWallpaper && (newValue === AppPage.Search || oldValue === AppPage.Search))
    setAppWallpaperMaskingOpacity()
})

onMounted(() => {
  setAppWallpaperMaskingOpacity()
})

function setAppWallpaperMaskingOpacity() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (settings.value.individuallySetSearchPageWallpaper && props.activatedPage === AppPage.Search)
    bewlyElement.style.setProperty('--bew-homepage-bg-mask-opacity', `${settings.value.searchPageWallpaperMaskOpacity}%`)
  else
    bewlyElement.style.setProperty('--bew-homepage-bg-mask-opacity', `${settings.value.wallpaperMaskOpacity}%`)
}
</script>

<template>
  <div>
    <!-- linear gradient background -->
    <Transition name="fade">
      <div
        v-if="settings.useLinearGradientThemeColorBackground && isDark"
        :style="{
          opacity: activatedPage === AppPage.Search ? 1 : 0.4,
          background: themeColorLinearGradientBackground,
        }"
        pos="absolute top-0 left-0" w-full h-full z-0 pointer-events-none
      />
    </Transition>

    <Transition name="fade">
      <div v-if="activatedPage === AppPage.Search">
        <!-- background -->
        <div
          pos="absolute top-0 left-0" w-full h-full duration-300 bg="cover center $bew-homepage-bg"
          z--1 transform-gpu
          :style="{ backgroundImage: `url('${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaper : settings.wallpaper}')` }"
        />
        <!-- background mask -->
        <Transition name="fade">
          <div
            v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (settings.searchPageEnableWallpaperMasking)"
            pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-homepage-bg-mask"
            duration-300 z--1 transform-gpu
            :style="{
              backdropFilter: `blur(${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaperBlurIntensity : settings.wallpaperBlurIntensity}px)`,
            }"
          />
        </Transition>
      </div>
      <div v-else>
        <!-- background -->
        <div
          :style="{ backgroundImage: `url('${settings.wallpaper}')` }"
          pos="absolute top-0 left-0" w-full h-full duration-300 bg="cover center $bew-homepage-bg"
          z--1 transform-gpu
        />

        <!-- blurred cover background -->
        <Transition name="fade">
          <Transition
            v-if="!settings.wallpaper && !settings.disableFrostedGlass"
            v-show="isBlurredCoverLoaded"
            name="slide-fade"
          >
            <img
              :key="currentActivatedCover"
              :src="currentActivatedCover"
              loading="eager"
              style="
                mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent);
                filter: blur(20px) opacity(0.15);
                will-change: transform, opacity;
              "
              pointer-events-none
              pos="absolute top--40px left-0" w="100%" h="50%" of-hidden
              transform-gpu
              object-cover @load="isBlurredCoverLoaded = true"
            >
          </Transition>
        </Transition>

        <!-- background mask -->
        <Transition name="fade">
          <div
            v-if="settings.enableWallpaperMasking"
            pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-homepage-bg-mask"
            duration-300 z--1 transform-gpu
            :style="{
              backdropFilter: `blur(${settings.wallpaperBlurIntensity}px)`,
            }"
          />
        </Transition>
      </div>
    </Transition>
  </div>
</template>
