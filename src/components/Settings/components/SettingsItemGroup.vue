<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
}>()
</script>

<template>
  <div class="b-settings-item-group" mb-6>
    <p text="base $bew-text-1" fw-bold>
      {{ title }}
    </p>
    <p v-if="desc" text="sm $bew-text-2">
      {{ desc }}
    </p>

    <main border="1 solid $bew-border-color" mt-2 px-4 mx--4 rounded="$bew-radius" bg="dark:$bew-fill-1">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
// .b-settings-item-group + .b-settings-item-group {
//   --at-apply: mt-4
// }
</style>
