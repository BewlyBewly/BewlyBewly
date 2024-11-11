<script lang="ts" setup>
import { useBewlyApp } from '~/composables/useAppProvider'
import { settings } from '~/logic'
import { isHomePage } from '~/utils/main'

const props = defineProps<{
  href: string
  title?: string
  rel?: string
  type: 'topBar' | 'videoCard'
  customClickEvent?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void
}>()

const { openIframeDrawer } = useBewlyApp()

const openMode = computed(() => {
  if (props.type === 'topBar')
    return settings.value.topBarLinkOpenMode
  else if (props.type === 'videoCard')
    return settings.value.videoCardLinkOpenMode
  return 'newTab'
})

const target = computed(() => {
  if (openMode.value === 'newTab') {
    return '_blank'
  }
  if (openMode.value === 'currentTabIfNotHomepage') {
    return isHomePage() ? '_blank' : '_self'
  }
  if (openMode.value === 'currentTab') {
    return '_self'
  }
  return '_self'
})

function handleClick(event: MouseEvent) {
  if (props.customClickEvent) {
    emit('click', event)
    return
  }

  if (openMode.value === 'drawer' && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
    openIframeDrawer(props.href)
  }
}
</script>

<template>
  <a :href="href" :target="target" :title="title" :rel="rel" @click="handleClick">
    <slot />
  </a>
</template>
