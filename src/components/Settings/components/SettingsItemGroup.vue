<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
}>()
</script>

<template>
  <div class="b-settings-item-group" mb-6>
    <p text="base $bew-text-1" font-semibold>
      {{ title }}
    </p>
    <p v-if="desc" text="sm $bew-text-2">
      {{ desc }}
    </p>

    <main border="1 solid $bew-border-color" mt-2 p-4 rounded="$bew-radius" bg="$bew-elevated-solid-2" shadow="$bew-shadow-1">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
// .b-settings-item-group + .b-settings-item-group {
//   --at-apply: mt-4
// }
</style>
