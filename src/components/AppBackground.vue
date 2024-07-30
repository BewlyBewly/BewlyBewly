<script setup lang="ts">
import { useDark } from '~/composables/useDark'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'

const props = defineProps<{ activatedPage: AppPage }>()

const { isDark } = useDark()

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
    <Transition name="fade">
      <!-- linear gradient background -->
      <div
        v-if="settings.useLinearGradientThemeColorBackground && isDark"
        pos="absolute top-0 left-0" w-full h-full z-0 pointer-events-none
        of-hidden opacity-60
      >
        <div
          pos="absolute bottom--20% left-50%" transform="translate-x--1/2" w="120%" h="60%" bg="$bew-theme-color"
          important-blur-140 important-saturate-240
          rounded-full z-1
        />
        <div
          pos="absolute bottom--30% left-50%" transform="translate-x--1/2" w="110%" h="50%" bg="$bew-theme-color"
          important-blur-120 important-brightness-120
          rounded-full z-2
        />
        <div
          pos="absolute bottom--30% left-50%" transform="translate-x--1/2" w="110%" h="50%" bg="$bew-theme-color"
          important-blur-100 important-brightness-180
          rounded-full z-3
        />
        <div
          pos="absolute bottom--36% left-50%" transform="translate-x--1/2" w="110%" h="40%" bg-white
          important-blur-100
          rounded-full z-3
        />
      </div>
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
