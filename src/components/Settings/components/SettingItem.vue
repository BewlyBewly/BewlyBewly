<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
}>()
</script>

<template>
  <div flex="~ gap-4" justify-betwee items-center py-2 text-base>
    <div w="5/7">
      {{ title }}
      <br>
      <span text="sm $bew-text-3">
        <slot name="desc">
          {{ desc }}
        </slot>
      </span>
    </div>

    <div w="2/7">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
