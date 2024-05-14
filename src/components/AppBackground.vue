<script setup lang="ts">
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'

const props = defineProps<{ activatedPage: AppPage }>()

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
</template>
