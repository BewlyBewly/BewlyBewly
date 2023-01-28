<script setup lang="ts">
interface Props {
  percentage: number
  color?: string
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--bew-theme-color)',
})
</script>

<template>
  <div
    h="6px"
    rounded="$bew-radius"
    :style="{
      width: `${percentage}%`,
      backgroundColor: props.color,
      height:
        typeof props.height === 'number' ? `${props.height}px` : props.height,
    }"
  />
</template>

<style lang="scss" scoped></style>
