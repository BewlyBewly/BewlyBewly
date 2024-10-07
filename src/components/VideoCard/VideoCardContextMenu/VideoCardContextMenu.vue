<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { useBewlyApp } from '~/composables/useAppProvider'
import { settings } from '~/logic'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'

import type { Video } from '../VideoCard.vue'
import DislikeDialog from './components/DislikeDialog.vue'

const props = defineProps<{
  video: Video
  contextMenuStyles: CSSProperties
}>()

const emit = defineEmits<{
  (event: 'removed', selectedOpt?: { dislikeReasonId: number }): void
  (event: 'close'): void
}>()

const videoOptions = reactive<{ id: number, name: string }[]>([
  { id: 1, name: '不感兴趣' },
  { id: 2, name: '不想看此UP主' },
])

const showContextMenu = ref<boolean>(false)
const showDislikeDialog = ref<boolean>(false)
const showPipWindow = ref<boolean>(false)
const { openIframeDrawer } = useBewlyApp()

enum VideoOption {
  OpenInNewTab,
  OpenInNewWindow,
  OpenInDrawer,
  ViewTheOriginalCover,
}

const commonOptions = computed((): { command: VideoOption, name: string, icon: string, color?: string }[][] => {
  return [
    [
      { command: VideoOption.OpenInNewTab, name: 'Open in new tab', icon: 'i-solar:square-top-down-bold-duotone' },
      { command: VideoOption.OpenInNewWindow, name: 'Open in new window', icon: 'i-solar:maximize-square-3-bold-duotone' },
      { command: VideoOption.OpenInDrawer, name: 'Open in drawer', icon: 'i-solar:archive-up-minimlistic-bold-duotone' },
    ],

    [
      { command: VideoOption.ViewTheOriginalCover, name: 'View the original cover', icon: 'i-solar:gallery-minimalistic-bold-duotone' },
    ],
  ]
})

onMounted(() => {
  showContextMenu.value = true
})

function handleMoreCommand(_command: number) {
  handleRemoved()
}

function handleAppMoreCommand(command: ThreePointV2Type) {
  switch (command) {
    case ThreePointV2Type.Feedback:
      break
    case ThreePointV2Type.Dislike:
      openAppDislikeDialog()
      break
  }
}

function handleCommonCommand(command: VideoOption) {
  switch (command) {
    case VideoOption.OpenInNewTab:
      window.open(props.video.url, '_blank')
      handleClose()
      break
    case VideoOption.OpenInNewWindow:
      showPipWindow.value = true
      break
    case VideoOption.OpenInDrawer:
      openIframeDrawer(props.video.url || '')
      handleClose()
      break

    case VideoOption.ViewTheOriginalCover:
      window.open(props.video.cover, '_blank')
      handleClose()
      break
  }
}

function openAppDislikeDialog() {
  showDislikeDialog.value = true
  showContextMenu.value = false
}

function handleClose() {
  showContextMenu.value = false
  showPipWindow.value = false
  emit('close')
}

function handleRemoved(selectedOpt?: { dislikeReasonId: number }) {
  emit('removed', selectedOpt)
  handleClose()
}
</script>

<template>
  <div>
    <Transition name="fade">
      <!-- more popup -->
      <div v-if="showContextMenu">
        <div
          style="backdrop-filter: var(--bew-filter-glass-1);"
          :style="contextMenuStyles"
          p-2 bg="$bew-elevated" rounded="$bew-radius"
          min-w-150px m="t-4 l-[calc(-150px+1rem)]"
          shadow="$bew-shadow-1" z-10
        >
          <ul flex="~ col gap-1">
            <template v-if="settings.recommendationMode === 'app'">
              <template v-for="option in video.threePointV2" :key="option.type">
                <li
                  v-if="option.type !== ThreePointV2Type.WatchLater && option.type !== ThreePointV2Type.Feedback"
                  class="context-menu-item"
                  @click="handleAppMoreCommand(option.type)"
                >
                  <i class="item-icon" i-solar:confounded-circle-bold-duotone />
                  <span v-if="option.type === ThreePointV2Type.Dislike">{{ $t('home.not_interested') }}</span>
                  <span v-else>{{ option.title }}</span>
                </li>
              </template>
            </template>
            <template v-else>
              <li
                v-for="option in videoOptions" :key="option.id"
                class="context-menu-item"
                @click="handleMoreCommand(option.id)"
              >
                <i class="item-icon" i-solar:confounded-circle-bold-duotone />
                {{ option.name }}
              </li>
            </template>

            <template v-for="(optionGroup, index) in commonOptions" :key="index">
              <div class="divider" />

              <li
                v-for="option in optionGroup"
                :key="option.command"
                class="context-menu-item"
                @click="handleCommonCommand(option.command)"
              >
                <i class="item-icon" :class="option.icon" />
                {{ option.name }}
              </li>
            </template>
          </ul>
        </div>
      </div>
    </Transition>

    <!-- mask -->
    <div
      v-if="showContextMenu"
      pos="fixed top-0 left-0" w-full h-full
      @click="handleClose"
    />

    <DislikeDialog
      v-model="showDislikeDialog"
      :video="video"
      @close="handleClose"
      @removed="handleRemoved"
    />

    <PipWindow
      v-if="showPipWindow"
      :url="video.url"
      @close="handleClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.context-menu-item {
  --uno: "hover:bg-$bew-fill-2 px-4 py-2 rounded-$bew-radius-half cursor-pointer";
  --uno: "flex items-center";
}

.item-icon {
  --uno: "mr-2 inline-block color-$bew-text-color-2";
}

.divider {
  --uno: "w-full h-1px my-1 bg-$bew-border-color";
}
</style>
