<script setup lang="ts">
defineProps<{
  percentage: number
}>()
</script>

<template>
  <div
    bg="$bew-theme-color"
    h="6px"
    border="rounded-$bew-radius"
    :style="{ width: `${percentage}%` }"
  />
</template>

<style lang="scss" scoped></style>
