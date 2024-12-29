<script setup lang="ts">
import { useDark } from '~/composables/useDark'

const props = defineProps<{
  url: string
}>()
const { isDark } = useDark()
const headerShow = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentUrl = ref<string>(props.url)

watch(() => isDark.value, (newValue) => {
  iframeRef.value?.contentDocument?.documentElement.classList.toggle('dark', newValue)
})

onMounted(() => {
  nextTick(() => {
    iframeRef.value?.focus()
  })
})

onBeforeUnmount(() => {
  releaseIframeResources()
})

async function releaseIframeResources() {
  // Clear iframe content
  currentUrl.value = 'about:blank'
  iframeRef.value?.contentWindow?.document.write('')
  await nextTick()
  iframeRef.value?.contentWindow?.close()

  // Remove iframe from the DOM
  iframeRef.value?.parentNode?.removeChild(iframeRef.value)
  await nextTick()

  // Nullify the reference
  iframeRef.value = null
}

function handleBackToTop() {
  if (iframeRef.value) {
    iframeRef.value.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleRefresh() {
  if (iframeRef.value) {
    iframeRef.value.contentWindow?.location.reload()
  }
}

defineExpose({
  handleBackToTop,
  handleRefresh,
})
</script>

<template>
  <div
    pos="absolute top-0 left-0" of-hidden w-100vw h-100vh
  >
    <!-- Iframe -->
    <iframe
      ref="iframeRef"
      :src="props.url"
      :style="{
        bottom: headerShow ? `var(--bew-top-bar-height)` : '0',
      }"
      frameborder="0"
      pointer-events-auto
      pos="absolute  left-0"
      w-inherit h-inherit
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
