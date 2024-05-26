<script setup lang="ts">
import Button from '~/components/Button.vue'
import { useBewlyApp } from '~/composables/useAppProvider'

const emit = defineEmits(['refresh', 'back-to-top'])

const { reachTop } = useBewlyApp()
</script>

<template>
  <div
    pos="fixed right-24 bottom-4" z-20
  >
    <Button
      size="small"
      center
      style="
        --b-button-width: 45px;
        --b-button-height: 45px;
        --b-button-border-width: 1px;
        --b-button-color: var(--bew-elevated-1);
        --b-button-color-hover: var(--bew-elevated-1-hover);
        --b-button-shadow: var(--bew-shadow-1);
        --b-button-shadow-hover: var(--bew-shadow-2);
        --b-button-shadow-active: var(--bew-shadow-1);
        backdrop-filter: var(--bew-filter-glass-1);
      "
      transform-gpu
      @click="reachTop ? emit('refresh') : emit('back-to-top')"
    >
      <Transition name="fade">
        <div
          v-if="reachTop" i-line-md:rotate-270 text-lg shrink-0 rotate-90
          absolute
        />
        <div v-else i-line-md:arrow-small-up text-lg shrink-0 absolute />
      </Transition>
    </Button>
  </div>
</template>
