<script setup lang="ts">
defineProps<{ showRefreshButton: boolean }>()
const emit = defineEmits(['refresh', 'back-to-top'])
</script>

<template>
  <div
    pos="fixed right-24 bottom-4" z-4
  >
    <!-- refresh button -->
    <Button
      v-if="showRefreshButton"
      size="small"
      frosted-glass shadow="$bew-shadow-1" w-45px important-h-45px
      @click="emit('refresh')"
    >
      <tabler:refresh text-lg shrink-0 />
    </Button>
    <!-- back to top button -->
    <Button
      v-else
      size="small"
      frosted-glass shadow="$bew-shadow-1" w-45px important-h-45px mt-2
      @click="emit('back-to-top')"
    >
      <tabler:arrow-big-up text-lg shrink-0 />
    </Button>
  </div>
</template>
