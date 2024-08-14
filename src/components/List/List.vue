<script setup lang="ts">
withDefaults(defineProps<{
  highlightFirst?: boolean
  pinTop?: boolean
}>(), {
  highlightFirst: false,
})
</script>

<template>
  <div
    class="b-list"
    :class="{ 'highlight-first': highlightFirst, 'pin-top': pinTop }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.b-list {
  &.highlight-first :deep(.b-list-item:first-child) {
    --uno: "!bg-$bew-fill-2 !font-bold";
  }

  &.pin-top :deep(.b-list-item:first-child) {
    --uno: "sticky top-0";
  }
}
</style>
