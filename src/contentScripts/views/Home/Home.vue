<script setup lang="ts">
import RecommendContent from './components/RecommendContent.vue'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'

const recommendContentKey = ref<string>(`recommendContent${Number(new Date())}`)

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
  <div
    v-if="settings.useSearchPageModeOnHomePage"
    flex="~ col"
    justify-center
    items-center relative
    w-full z-10
    h-50vh max-h-550px
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

  <RecommendContent :key="recommendContentKey" />
</template>

<style scoped lang="scss"></style>
