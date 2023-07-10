<script lang="ts" setup>
defineProps<{
  content: string
  placement: 'left' | 'right' | 'top' | 'bottom'
}>()
</script>

<template>
  <span class="tooltip-wrapper">
    <div
      class="tooltip"
      :class="placement"
    >
      {{ content }}
    </div>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.tooltip-wrapper {
  --at-apply: flex items-center relative;

  .tooltip {
    --at-apply: absolute px-2 py-1 rounded-8
      bg-black dark:bg-white
      pointer-events-none
      text-sm text-white dark:text-black
      opacity-0 duration-300
      shadow-$bew-shadow-2;
    white-space: nowrap;

    &.right {
      --at-apply: left-[calc(100%+0.5em)];
    }

    &.left{
      --at-apply: right-[calc(100%+0.5em)];
    }

    &.top {
      --at-apply: top--2.5em left-1/2;
      transform: translateX(-50%);
    }

    &.bottom {
      --at-apply: bottom--2.5em left-1/2;
      transform: translateX(-50%);
    }
  }

  &:hover .tooltip {
    --at-apply: opacity-100;
  }
}
</style>
