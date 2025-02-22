<script setup lang="ts">
import { onKeyStroke, useEventListener } from '@vueuse/core'

import { DRAWER_VIDEO_ENTER_PAGE_FULL, DRAWER_VIDEO_EXIT_PAGE_FULL } from '~/constants/globalEvents'
import { settings } from '~/logic'
import { isHomePage, isInIframe } from '~/utils/main'

// TODO: support shortcuts like `Ctrl+Alt+T` to open in new tab, `Esc` to close

const props = defineProps<{
  url: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const show = ref(false)
const headerShow = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentUrl = ref<string>(props.url)
const showIframe = ref<boolean>(false)
const delayCloseTimer = ref<NodeJS.Timeout | null>(null)
const removeTopBarClassInjected = ref<boolean>(false)

useEventListener(window, 'popstate', updateIframeUrl)
nextTick(() => {
  useEventListener(iframeRef.value?.contentWindow, 'historyChange', updateCurrentUrl)
  useEventListener(iframeRef.value?.contentWindow, 'popstate', updateCurrentUrl)

  useEventListener(iframeRef.value?.contentWindow, 'DOMContentLoaded', () => {
    if (headerShow.value) {
      iframeRef.value?.contentWindow?.document.documentElement.classList.add('remove-top-bar-without-placeholder')
      removeTopBarClassInjected.value = true
    }
    else {
      iframeRef.value?.contentWindow?.document.documentElement.classList.remove('remove-top-bar-without-placeholder')
      removeTopBarClassInjected.value = false
    }
  })
})

onMounted(() => {
  history.pushState(null, '', props.url)
  show.value = true
  headerShow.value = true
  nextTick(() => {
    iframeRef.value?.focus()
  })
})

onBeforeUnmount(() => {
  releaseIframeResources()
})

onUnmounted(() => {
  history.replaceState(null, '', 'https://www.bilibili.com')
})

function updateCurrentUrl() {
  if (iframeRef.value?.contentWindow) {
    try {
      currentUrl.value = iframeRef.value.contentWindow.location.href.replace(/\/$/, '')
      history.pushState(null, '', currentUrl.value.replace(/\/$/, ''))
    }
    catch (error) {
      console.error('Unable to access iframe URL:', error)
    }
  }
}

async function updateIframeUrl() {
  if (isHomePage()) {
    await handleClose()
    return
  }
  await nextTick()

  if (iframeRef.value?.contentWindow) {
    iframeRef.value.contentWindow.location.replace(location.href.replace(/\/$/, ''))
  }
}

async function handleClose() {
  if (delayCloseTimer.value) {
    clearTimeout(delayCloseTimer.value)
  }
  await releaseIframeResources()
  show.value = false
  headerShow.value = false
  delayCloseTimer.value = setTimeout(() => {
    emit('close')
  }, 300)
}

async function releaseIframeResources() {
  // Clear iframe content
  currentUrl.value = 'about:blank'
  /**
   * eg: When use 'iframeRef.value?.contentWindow?.document' of t.bilibili.com iframe on bilibili.com, there may be cross domain issues
   * set the src to 'about:blank' to avoid this issue, it also can release the memory
   */
  if (iframeRef.value) {
    iframeRef.value.src = 'about:blank'
  }
  await nextTick()
  iframeRef.value?.contentWindow?.close()

  // Remove iframe from the DOM
  iframeRef.value?.parentNode?.removeChild(iframeRef.value)
  await nextTick()

  // Nullify the reference
  iframeRef.value = null
}

function handleOpenInNewTab() {
  if (iframeRef.value) {
    window.open(iframeRef.value.contentWindow?.location.href.replace(/\/$/, ''), '_blank')
    handleClose()
  }
}

const isEscPressed = ref<boolean>(false)
const escPressedTimer = ref<NodeJS.Timeout | null>(null)
const disableEscPress = ref<boolean>(false)

nextTick(() => {
  onKeyStroke('Escape', (e: KeyboardEvent) => {
    e.preventDefault()
    if (settings.value.closeDrawerWithoutPressingEscAgain) {
      clearTimeout(escPressedTimer.value!)
      handleClose()
      return
    }
    if (disableEscPress.value)
      return
    if (isEscPressed.value) {
      handleClose()
    }
    else {
      isEscPressed.value = true
      if (escPressedTimer.value) {
        clearTimeout(escPressedTimer.value)
      }
      escPressedTimer.value = setTimeout(() => {
        isEscPressed.value = false
      }, 1300)
    }
  }, { target: iframeRef.value?.contentWindow })
})

watchEffect(() => {
  if (isInIframe())
    return null

  useEventListener(window, 'message', ({ data }) => {
    switch (data) {
      case DRAWER_VIDEO_ENTER_PAGE_FULL:
        headerShow.value = false
        disableEscPress.value = true
        break
      case DRAWER_VIDEO_EXIT_PAGE_FULL:
        headerShow.value = true
        disableEscPress.value = false
        break
    }
  })
})

// const keys = useMagicKeys()
// const ctrlAltT = keys['Ctrl+Alt+T']

// watch(() => ctrlAltT, (value) => {
//   if (value) {
//     handleOpenInNewTab()
//   }
// })
</script>

<template>
  <div
    pos="absolute top-0 left-0" of-hidden w-full h-full
    z-999999
  >
    <!-- Mask -->
    <Transition name="fade">
      <div
        v-if="show"
        pos="absolute bottom-0 left-0" w-full h-full bg="black opacity-60"
        @click="handleClose"
      />
    </Transition>

    <Transition name="fade">
      <div
        v-if="headerShow"
        pos="relative top-0" flex="~ items-center justify-end gap-2"
        max-w="$bew-page-max-width" w-full h="$bew-top-bar-height"
        m-auto px-4
        pointer-events-none
      >
        <Button
          style="
            --b-button-color: var(--bew-elevated-solid);
            --b-button-color-hover: var(--bew-elevated-solid-hover);
          "
          pointer-events-auto
          @click="handleOpenInNewTab"
        >
          <template #left>
            <i i-mingcute:external-link-line />
          </template>
          {{ $t('iframe_drawer.open_in_new_tab') }}
          <!-- <div flex="~">
            <kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>T</kbd>
          </div> -->
        </Button>
        <Button
          v-if="!isEscPressed"
          style="
            --b-button-color: var(--bew-elevated-solid);
            --b-button-color-hover: var(--bew-elevated-solid-hover);
          "
          pointer-events-auto
          @click="handleClose"
        >
          <template #left>
            <i i-mingcute:close-line />
          </template>
          {{ $t('iframe_drawer.close') }}
          <kbd>Esc</kbd>
        </Button>
        <Button
          v-else
          type="error"
          @click="handleClose"
        >
          <template #left>
            <i i-mingcute:close-line />
          </template>
          {{ $t('iframe_drawer.press_esc_again_to_close') }}
          <kbd>Esc</kbd>
        </Button>
      </div>
    </Transition>

    <!-- Iframe -->
    <Transition name="drawer">
      <div
        v-if="show"
        :pos="`absolute ${headerShow ? 'top-$bew-top-bar-height' : 'top-0'} left-0`" of-hidden bg="$bew-bg"
        rounded="t-$bew-radius" w-full h-full
      >
        <Transition name="fade">
          <iframe
            v-show="showIframe"
            ref="iframeRef"
            :src="props.url"
            :style="{
              // Prevent top bar shaking when before the remove-top-bar-without-placeholder class is injected
              top: !removeTopBarClassInjected ? `calc(-1 * var(--bew-top-bar-height))` : '0',
            }"
            frameborder="0"
            pointer-events-auto
            pos="relative left-0"
            w-full
            h-full @load="showIframe = true"
          />
        </Transition>
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
