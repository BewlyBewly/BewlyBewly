<script setup lang="ts">
import { settings } from '~/logic'

function toggleBewlyTopBar() {
  settings.value.useOriginalBilibiliTopBar = !settings.value.useOriginalBilibiliTopBar
  settings.value.showTopBar = !settings.value.showTopBar
}
</script>

<template>
  <div
    class="group"
    pos="fixed top-0 right-0"
    z-10
    w-full
    flex="~ items-center justify-center"
    m="t-[calc(var(--bew-top-bar-height)-20px)]"
    p="t-30px"
  >
    <button
      style="backdrop-filter: var(--bew-filter-glass-1);"
      pos="absolute"
      class="opacity-0 group-hover:opacity-100"
      transform="translate-y--100% group-hover:translate-y-0 hover:translate-y-0"
      flex="~ items-center gap-2"
      text="$bew-text-2 sm"
      bg="$bew-elevated" p="x-2 y-1" mt-2
      rounded="full" shadow="$bew-shadow-1"
      duration-300
      @click="toggleBewlyTopBar"
    >
      <i i-mingcute:transfer-3-line text-xs />
      <span>
        <template v-if="settings.showTopBar">
          {{ $t('topbar.switch_to_bili_top_bar') }}
        </template>
        <template v-else>
          {{ $t('topbar.switch_to_bewly_top_bar') }}
        </template>
      </span>
    </button>
  </div>
</template>
