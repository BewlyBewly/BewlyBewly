<script lang="ts" setup>
import { settings } from '~/logic'
</script>

<template>
  <div
    flex="~ col"
    justify-center
    items-center
    w-full
    m="t-20vh"
  >
    <Logo v-if="settings.searchPageShowLogo" :size="180" mb-12 :color="settings.searchPageLogoColor === 'white' ? 'white' : 'var(--bew-theme-color)'" />
    <SearchBar />
  </div>
</template>
