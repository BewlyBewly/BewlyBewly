<script setup lang="ts">
import { Icon } from '@iconify/vue'

import Button from '~/components/Button.vue'
import { useBewlyApp } from '~/composables/useAppProvider'

const emit = defineEmits(['refresh', 'backToTop'])

const { reachTop } = useBewlyApp()
</script>

<template>
  <div
    pos="fixed right-24 bottom-4" z-20
  >
    <Button
      size="small"
      center
      round
      style="
        --b-button-width: 45px;
        --b-button-height: 45px;
        --b-button-border-width: 1px;
        --b-button-color: var(--bew-elevated);
        --b-button-color-hover: var(--bew-elevated-hover);
        --b-button-shadow: var(--bew-shadow-1), var(--bew-shadow-edge-glow-1);
        --b-button-shadow-hover: var(--bew-shadow-2), var(--bew-shadow-edge-glow-1);
        --b-button-shadow-active: var(--bew-shadow-1), var(--bew-shadow-edge-glow-1);
        backdrop-filter: var(--bew-filter-glass-1);
      "
      transform-gpu
      @click="reachTop ? emit('refresh') : emit('backToTop')"
    >
      <Transition name="fade">
        <Icon
          v-if="reachTop"
          icon="line-md:rotate-270"
          shrink-0 rotate-90 absolute text-2xl
        />
        <Icon
          v-else
          icon="line-md:arrow-small-up"
          shrink-0 absolute text-2xl
        />
      </Transition>
    </Button>
  </div>
</template>
