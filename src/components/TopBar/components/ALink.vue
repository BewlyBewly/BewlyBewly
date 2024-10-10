<script lang="ts" setup>
import { settings } from '~/logic'
import { isHomePage } from '~/utils/main'

defineProps<{
  href?: string
  title?: string
  rel?: string
}>()

const target = computed(() => {
  if (settings.value.topBarLinkOpenMode === 'newTab') {
    return '_blank'
  }
  if (settings.value.topBarLinkOpenMode === 'currentTabIfNotHomepage') {
    return isHomePage() ? '_blank' : '_self'
  }
  if (settings.value.topBarLinkOpenMode === 'currentTab') {
    return '_self'
  }
  return '_self'
})
</script>

<template>
  <a :href="href" :target="target" :title="title" :rel="rel">
    <slot />
  </a>
</template>
