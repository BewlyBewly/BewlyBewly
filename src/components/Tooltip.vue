<script lang="ts" setup>
defineProps<{
  content: string
  placement: 'left' | 'right' | 'top' | 'bottom'
  type?: 'default' | 'dark' | 'white'
}>()
</script>

<template>
  <span class="b-tooltip-wrapper">
    <div
      class="b-tooltip"
      :class="[`b-tooltip--placement-${placement ?? 'top'}`, `b-tooltip--type-${type ?? 'default'}`]"
    >
      {{ content }}
    </div>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.b-tooltip-wrapper {
  --at-apply: flex items-center relative;

  .b-tooltip {
    --at-apply: absolute px-2 lh-2em rounded-8 pointer-events-none text-sm
      opacity-0 duration-300 shadow-$bew-shadow-2;
    white-space: nowrap;

    &--placement-right {
      --at-apply: left-[calc(100%+0.5em)];
    }

    &--placement-left {
      --at-apply: right-[calc(100%+0.5em)];
    }

    &--placement-top {
      --at-apply: top--2.5em left-1/2;
      transform: translateX(-50%);
    }

    &--placement-bottom {
      --at-apply: bottom--2.5em left-1/2;
      transform: translateX(-50%);
    }

    &--type-default {
      --at-apply: 'text-white dark:text-black bg-black dark:bg-white';
    }

    &--type-dark {
      --at-apply: text-white bg-black;
    }

    &--type-white {
      --at-apply: text-black bg-white;
    }
  }

  &:hover .b-tooltip {
    --at-apply: opacity-100;
  }
}
</style>
