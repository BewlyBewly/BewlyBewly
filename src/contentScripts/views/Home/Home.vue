<script setup lang="ts">
import RecommendContent from './components/RecommendContent.vue'
import Following from './components/Following.vue'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'

const recommendContentKey = ref<string>(`recommendContent${Number(new Date())}`)
const activatedPage = ref<'RecommendContent' | 'Following'>('RecommendContent')
const pages = { RecommendContent, Following }

const tabs = reactive<{ label: string; value: 'RecommendContent' | 'Following' }[]>([
  {
    label: 'For you',
    value: 'RecommendContent',
  },
  {
    label: 'Following',
    value: 'Following',
  },
])

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
          px-4 lh-40px bg="$bew-elevated-2" backdrop-glass rounded="$bew-radius"
          cursor-pointer shadow="$bew-shadow-2"
          :style="{ backgroundColor: activatedPage === tab.value ? 'var(--bew-theme-color)' : null }"
          @click="activatedPage = tab.value"
        >
          {{ tab.label }}
        </li>
      </ul>
    </header>
    <Component :is="pages[activatedPage]" :key="recommendContentKey" />
    <!-- <RecommendContent :key="recommendContentKey" /> -->
  </div>
</template>

<style scoped lang="scss"></style>
