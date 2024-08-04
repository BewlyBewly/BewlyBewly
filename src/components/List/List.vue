<script setup lang="ts">
withDefaults(defineProps<{
  highlightFirst?: boolean
}>(), {
  highlightFirst: false,
})
</script>

<template>
  <div
    class="b-list"
    :class="{ 'highlight-first': highlightFirst }"
    rounded="$bew-radius" border="1 $bew-border-color"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.b-list.highlight-first {
  :deep(.b-list-item) {
    --uno: "first-!bg-$bew-fill-2 first-!font-bold";
  }
}
</style>
