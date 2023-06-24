<script setup lang="ts">
defineProps<{
  tab: string
  name: string
}>()
</script>

<template>
  <div
    flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
  >
    {{ tab }}
  </div>
</template>

<style lang="scss" scoped>
.activated {
  --at-apply: bg-$bew-theme-color text-white;
}
</style>
