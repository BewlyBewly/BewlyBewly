<script setup lang="ts">
defineProps<{
  horizontal?: boolean
}>()
</script>

<template>
  <div
    :style="{
      display: horizontal ? 'flex' : 'block',
    }"
    gap-4
    mb-6
  >
    <div
      rounded="$bew-radius" aspect="12/16" overflow-hidden mb-4 bg="$bew-skeleton"
      shrink-0
      :style="{ width: horizontal ? '170px' : '100%' }"
    />
    <div w-full>
      <p
        w-full h-5 mt-2 mb-3 my-4
        bg="$bew-skeleton"
        rounded-4px
      />
      <div text="$bew-skeleton" mb-10 flex items-center rounded-4px>
        <div
          text="transparent" bg="$bew-skeleton" p="x-3 y-1" mr-2 h-24px
          rounded-4
        >
          0.0
        </div>
        <div w="60%" h-22px bg="$bew-skeleton" rounded-4px />
      </div>
    </div>
  </div>
</template>
