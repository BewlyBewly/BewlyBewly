<script setup lang="ts">
import { useRefs } from '@vueuse/core'

import type { HomeTab } from '~/stores/mainStore'

interface Props {
  tabs: HomeTab[]
  value: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emits = defineEmits(['tabClick']) // 使用简化的写法
const tabRefs = ref<HTMLElement[]>([])
const aniBgStyle = ref({
  transform: 'translateX(0)',
  width: '100%',
})

onMounted(() => {
  // 延迟执行，等待 dom 渲染完成
  setTimeout(() => {
    updateAniBgPosition()
  }, 100)
})

function handleChangeTab(tab: HomeTab) {
  emits('tabClick', tab)
  nextTick(() => {
    updateAniBgPosition()
  })
}

function updateAniBgPosition() {
  const newActiveEl = tabRefs.value[props.value]

  if (newActiveEl) {
    const parentEl = newActiveEl.parentElement
    if (!parentEl)
      return

    const parentRect = parentEl.getBoundingClientRect()
    const rect = newActiveEl.getBoundingClientRect()
    const left = rect.left - parentRect.left

    aniBgStyle.value = {
      transform: `translateX(${left}px)`,
      width: `${rect.width}px`,
    }
  }
}
</script>

<template>
  <div class="relative flex">
    <div
      class="ani-bg absolute duration-300"
      :class="{ breathing: props.loading }"
      :style="aniBgStyle"
    />
    <div
      flex="~ items-center gap-1 wrap"
      p-1
      h-38px
      rounded-full
      bg="$bew-elevated"
      box-border border="1 $bew-border-color"
      shadow="[var(--bew-shadow-1),var(--bew-shadow-edge-glow-1)]"
    >
      <button
        v-for="tab in props.tabs"
        :ref="el => { if (el) tabRefs[tab.page] = el }"
        :key="tab.page"
        :class="{ 'text-$bew-text-auto': value === tab.page }"
        px-4 py-2 h-full
        bg="transparent"
        rounded-full
        cursor-pointer
        flex="~ gap-2 items-center"
        relative
        @click="handleChangeTab(tab)"
      >
        <span class="text-center">{{ $t(tab.i18nKey) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ani-bg {
  top: 4px;
  left: 0;
  height: calc(100% - 8px);
  background: var(--bew-theme-color-auto);
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.breathing {
    animation: breathing 1.5s ease-in-out infinite;
  }
}

@keyframes breathing {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}
</style>
