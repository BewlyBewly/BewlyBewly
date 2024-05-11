<script lang="ts" setup>
import Logo from '~/components/Logo.vue'
import SearchBar from '~/components/SearchBar/SearchBar.vue'
import { settings } from '~/logic'
</script>

<template>
  <div
    flex="~ col"
    justify-center
    items-center
    w-full z-10
    m="t-20vh"
  >
    <Logo
      v-if="settings.searchPageShowLogo" :size="180" :color="settings.searchPageLogoColor === 'white' ? 'white' : 'var(--bew-theme-color)'"
      :glow="settings.searchPageLogoGlow"
      mb-12 z-1
    />
    <SearchBar
      :darken-on-focus="settings.searchPageDarkenOnSearchFocus"
      :blurred-on-focus="settings.searchPageBlurredOnSearchFocus"
      :focused-character="settings.searchPageSearchBarFocusCharacter"
    />
  </div>
</template>
