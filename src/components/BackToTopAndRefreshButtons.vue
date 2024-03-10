<script setup lang="ts">
defineProps<{ showRefreshButton: boolean }>()
const emit = defineEmits(['refresh', 'back-to-top'])
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
        backdrop-filter: var(--bew-filter-glass);
      "
      @click="showRefreshButton ? emit('refresh') : emit('back-to-top')"
    >
      <Transition name="fade">
        <line-md:rotate-270 v-if="showRefreshButton" text-lg shrink-0 rotate-90 absolute />
        <line-md:arrow-small-up v-else text-lg shrink-0 absolute />
      </Transition>
    </Button>
  </div>
</template>
