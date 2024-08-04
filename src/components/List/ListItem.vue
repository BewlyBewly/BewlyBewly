<script setup lang="ts">

</script>

<template>
  <div
    class="b-list-item"
    p="x-4 y-2"
    flex="~ gap-2"
    bg="odd:$bew-fill-1 hover:!$bew-fill-2"
    rounded="first:t-$bew-radius last:b-$bew-radius"
    duration-300
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.b-list-item {
  > * {
    --uno: "flex items-center flex-1 shrink-0";
  }

  & + & {
    --uno: "border-t-1 border-$bew-border-color";
  }
}
</style>
