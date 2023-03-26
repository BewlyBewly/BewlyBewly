<script setup lang="ts">
import browser from 'webextension-polyfill'

const props = defineProps<{
  description?: string
}>()

const emptyImg = browser.runtime.getURL('/assets/empty.png')
</script>

<template>
  <div flex="~ col gap-4" justify="center" items="center">
    <img :src="emptyImg" w="200px" h="auto">
    <span v-if="props.description" text="$bew-text-3">{{ props.description }}</span>
    <slot />
  </div>
</template>
