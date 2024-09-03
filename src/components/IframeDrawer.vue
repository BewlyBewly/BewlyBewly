<script setup lang="ts">
import { isHomePage } from '~/utils/main'

const props = defineProps<{
  url: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const show = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentUrl = ref<string>(props.url)

onMounted(async () => {
  history.pushState({}, '', props.url)
  show.value = true
  await nextTick()
  iframeRef.value?.contentWindow?.addEventListener('pushstate', updateCurrentUrl)
  window.addEventListener('popstate', updateIframeUrl)
})

onUnmounted(() => {
  history.pushState({}, '', 'https://www.bilibili.com')
  iframeRef.value?.contentWindow?.removeEventListener('pushstate', updateCurrentUrl)
  window.removeEventListener('popstate', updateIframeUrl)
})

function updateCurrentUrl() {
  if (iframeRef.value?.contentWindow) {
    try {
      currentUrl.value = iframeRef.value.contentWindow.location.href
      history.pushState({}, '', currentUrl.value)
    }
    catch (error) {
      console.error('Unable to access iframe URL:', error)
    }
  }
}

function updateIframeUrl() {
  if (isHomePage()) {
    handleClose()
    return
  }

  if (iframeRef.value?.contentWindow) {
    iframeRef.value.contentWindow.location.replace(location.href)
    // iframeRef.value.contentWindow.location.reload()
  }
}

function handleClose() {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<template>
  <div
    pos="absolute top-0 left-0" of-hidden w-full h-full
    z-100 pointer-events-none
  >
    <!-- Mask -->
    <div
      v-if="show"
      pos="absolute bottom-0 left-0" w-full h-full bg="black opacity-60"
      pointer-events-auto
      @click="handleClose"
    />

    <!-- Iframe -->
    <Transition name="drawer">
      <div
        v-if="show"
        pos="absolute bottom-0 left-0" bg="$bew-bg"
        w-full h="[calc(100%-var(--bew-top-bar-height))]"
      >
        <iframe
          ref="iframeRef"
          :src="url"
          frameborder="0"
          pointer-events-auto
          pos="absolute bottom-0 left-0"
          w-full h-full
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}
</style>
