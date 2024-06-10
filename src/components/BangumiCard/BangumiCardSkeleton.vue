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
      rounded="$bew-radius" aspect="12/16" overflow-hidden mb-4 bg="$bew-fill-4"
      shrink-0
      :style="{ width: horizontal ? '170px' : '100%' }"
    />
    <div w-full>
      <p w-full h-5 my-2 my-4 bg="$bew-fill-3" />
      <div text="$bew-fill-2" mb-10 flex items-center>
        <div
          text="transparent" bg="$bew-fill-2" p="x-3 y-1" mr-2 h-27px
          rounded-4
        >
          0.0
        </div>
        <div w="60%" h-4 bg="$bew-fill-2" />
      </div>
    </div>
  </div>
</template>
