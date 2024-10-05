<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { settings } from '~/logic'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'

import type { Video } from '../VideoCard.vue'
import DislikeDialog from './components/DislikeDialog.vue'

defineProps<{
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

function openAppDislikeDialog() {
  showDislikeDialog.value = true
  showContextMenu.value = false
}

function handleClose() {
  showContextMenu.value = false
  emit('close')
  nextTick(() => {
  })
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
          w-150px m="t-4 l-[calc(-150px+1rem)]"
          shadow="$bew-shadow-1" z-10
        >
          <ul flex="~ col gap-1">
            <template v-if="settings.recommendationMode === 'app'">
              <template v-for="option in video.threePointV2" :key="option.type">
                <li
                  v-if="option.type !== ThreePointV2Type.WatchLater && option.type !== ThreePointV2Type.Feedback"
                  bg="hover:$bew-fill-2" p="x-4 y-2" rounded="$bew-radius-half" cursor-pointer
                  @click="handleAppMoreCommand(option.type)"
                >
                  <span v-if="option.type === ThreePointV2Type.Dislike">{{ $t('home.not_interested') }}</span>
                  <span v-else>{{ option.title }}</span>
                </li>
              </template>
            </template>
            <template v-else>
              <li
                v-for="option in videoOptions" :key="option.id"
                bg="hover:$bew-fill-2" p="x-4 y-2" rounded="$bew-radius-half" cursor-pointer
                @click="handleMoreCommand(option.id)"
              >
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
  </div>
</template>
