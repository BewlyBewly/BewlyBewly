<script setup lang="ts">
// import { onKeyStroke } from '@vueuse/core'

import { useDark } from '~/composables/useDark'

const props = defineProps<{
  url: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pipWindowRef = ref<HTMLElement | null>(null)
const pipWindowEl = ref<any | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentUrl = ref<string>(props.url)
const { isDark } = useDark()

onMounted(() => {
  openPipWindow()
})

async function openPipWindow() {
  // https://developer.chrome.com/docs/web-platform/document-picture-in-picture
  if ('documentPictureInPicture' in window) {
    // The Document Picture-in-Picture API is supported.
    pipWindowEl.value = await (window as any).documentPictureInPicture.requestWindow({
      disallowReturnToOpener: true,
    })
    pipWindowEl.value.document.body.style.padding = '0'
    pipWindowEl.value.document.body.style.margin = '0'

    if (isDark.value) {
      // 爲 documentElement 添加主題色防止關閉時顏色白色切換
      pipWindowEl.value.document.documentElement.style.background = 'var(--bew-bg)'
      pipWindowEl.value.document.documentElement.classList.add('dark')
    }

    pipWindowEl.value.document.body.append(pipWindowRef.value)

    pipWindowEl.value.addEventListener('pagehide', () => {
      handleClose()
    })
  }
  else {
    const width = window.innerWidth * 0.8
    const height = window.innerHeight * 0.8
    const left = (screen.width / 2) - (width / 2)
    const top = (screen.height / 2) - (height / 2)
    window.open(currentUrl.value, '', `width=${width}px,height=${height}px,left=${left}px,top=${top}px,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,resizable=yes,status=no`)
    handleClose()
  }
}

function handleOpenInNewTab() {
  window.open(currentUrl.value, '_blank')
  handleClose()
}

async function handleClose() {
  await releaseIframeResources()
  await nextTick()
  if (pipWindowEl.value)
    pipWindowEl.value.close()
  await nextTick()
  emit('close')
}

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

// TODO: figure out why the `esc` key doesn't work in here

const isEscPressed = ref<boolean>(false)
// const escPressedTimer = ref<NodeJS.Timeout | null>(null)

// nextTick(() => {
//   onKeyStroke('Escape', (e: KeyboardEvent) => {
//     e.preventDefault()
//     if (isEscPressed.value) {
//       handleClose()
//     }
//     else {
//       isEscPressed.value = true
//       if (escPressedTimer.value) {
//         clearTimeout(escPressedTimer.value)
//       }
//       escPressedTimer.value = setTimeout(() => {
//         isEscPressed.value = false
//       }, 1300)
//     }
//   }, { target: iframeRef.value?.contentWindow })
// })
</script>

<template>
  <div ref="pipWindowRef">
    <div pos="absolute top-0 left-0" w-full h-full>
      <div
        pos="relative top-0" z-1 flex="~ items-center justify-end gap-2"
        w-full h="$bew-top-bar-height"
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
          mr-8
          @click="handleClose"
        >
          <template #left>
            <i i-mingcute:close-line />
          </template>
          {{ $t('iframe_drawer.close') }}
          <!-- <kbd>Esc</kbd> -->
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
          <!-- <kbd>Esc</kbd> -->
        </Button>
      </div>
      <iframe
        ref="iframeRef"
        :src="url" frameborder="0"
        w-full h-full p-0
        pos="absolute top-0 left-0"
        bg="$bew-bg"
      />
    </div>
  </div>
</template>
