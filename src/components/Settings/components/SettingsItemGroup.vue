<script setup lang="ts">
defineProps<{
  title?: string
  desc?: string
}>()
</script>

<template>
  <div class="b-settings-item-group">
    <p text="base $bew-text-1" fw-bold>
      {{ title }}
    </p>
    <p v-if="desc" text="sm $bew-text-2">
      {{ desc }}
    </p>

    <main
      style="box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-1);"
      mt-2 px-4 mx--4 rounded="$bew-radius"
      bg="$bew-content-1 dark:$bew-fill-1"
      shadow="$bew-shadow-edge-glow-1"
    >
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.b-settings-item-group + .b-settings-item-group {
  --uno: "mt-6";
}
</style>
