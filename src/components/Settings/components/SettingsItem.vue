<script setup lang="ts">
defineProps<{
  title?: string
  desc?: string
  nextLine?: boolean
}>()
</script>

<template>
  <div class="b-settings-item" py-4>
    <div flex="~ gap-4" justify-betwee items-center text-base>
      <div :w="nextLine ? 'full' : '5/7'">
        <div>
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div
          text="sm $bew-text-2"
          :style="{ marginTop: $slots.desc || desc ? '0.25rem' : '0' }"
        >
          <slot name="desc">
            {{ desc }}
          </slot>
        </div>
      </div>

      <div v-if="!nextLine" w="2/7" class="right-content">
        <slot />
      </div>
    </div>

    <div v-if="nextLine" mt-4>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.right-content > *) {
  --uno: "float-right clear-both";
}

.b-settings-item + .b-settings-item {
  --uno: "border-t-1 border-$bew-border-color";
}
</style>
