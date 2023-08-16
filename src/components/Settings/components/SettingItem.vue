<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
  nextLine?: boolean
}>()
</script>

<template>
  <div>
    <div flex="~ gap-4" justify-betwee items-center py-2 text-base>
      <div :w="nextLine ? 'full' : '5/7'">
        {{ title }}
        <br>
        <span text="sm $bew-text-2">
          <slot name="desc">
            {{ desc }}
          </slot>
        </span>
      </div>

      <div v-if="!nextLine" w="2/7" class="right-content">
        <slot />
      </div>
    </div>
    <slot v-if="nextLine" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.right-content > *) {
  --at-apply: float-right clear-both;
}
</style>
