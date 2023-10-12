<script lang="ts" setup>
interface Props {
  type?: | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  size?: 'small' | 'medium' | 'large'
  /** @description enable frosted glass effect */
  frostedGlass?: boolean
  color?: string
  textColor?: string
  strong?: boolean
  round?: boolean
  block?: boolean
  center?: boolean
}

// const props = withDefaults(defineProps<Props>(), {})
const props = defineProps<Props>()

const emit = defineEmits(['click'])

function handleClick(evt: MouseEvent) {
  emit('click', evt)
}
</script>

<template>
  <button
    class="b-button"
    :class="`
      b-button--type-${type ?? 'default'}
      b-button--size-${size ?? 'medium'}
      ${frostedGlass ? 'frosted-glass' : ''}
      ${strong ? 'b-button--strong' : ''}
      ${color || textColor ? 'b-button--custom-color' : ''}
    `"
    :style="{
      'backgroundColor': color,
      'color': textColor,
      '--b-button-radius': round ? '50px' : '',
      'width': block ? '100%' : 'var(--b-button-width)',
      'justifyContent': center ? 'center' : ''
    }"
    @click="handleClick"
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </button>
</template>

<style lang="scss" scoped>
.b-button {
  --b-button-color: var(--bew-content-solid-1);
  --b-button-color-hover: var(--bew-content-solid-1-hover);
  --b-button-text-color: var(--bew-text-1);
  --b-button-radius: var(--bew-radius);
  --b-button-padding: 14px;
  --b-button-font-size: 14px;
  --b-button-icon-size: 15px;
  --b-button-height: 35px;
  --b-button-width: fit-content;

  --at-apply: bg-$b-button-color hover:bg-$b-button-color-hover
    rounded-$b-button-radius p-x-$b-button-padding transform-gpu active:scale-95
    duration-300 flex items-center gap-2 text-size-$b-button-font-size
    text-$b-button-text-color lh-$b-button-height h-$b-button-height;

    & svg {
      --at-apply: text-size-$b-button-icon-size
    }

    &.frosted-glass {
      --b-button-color: var(--bew-content-1);
      --b-button-color-hover: var(--bew-content-1-hover);
      backdrop-filter: var(--bew-filter-glass);
    }

  &--type-default {
  }

  &--type-primary {
    --b-button-color: var(--bew-theme-color);
    --b-button-color-hover: var(--bew-theme-color);
    --b-button-text-color: white;
  }

  &--type-secondary {
    --b-button-color: var(--bew-fill-1);
    --b-button-color-hover: var(--bew-fill-2);
    --b-button-text-color: var(--bew-text-1);
  }

  &--type-error {
    --b-button-color: var(--bew-error-color);
    --b-button-color-hover: var(--bew-error-color)
    --b-button-text-color: white;
  }

  &--size-small {
    --b-button-padding: 6px;
    --b-button-font-size: 14px;
    --b-button-icon-size: 14px;
    --b-button-height: 30px;
  }

  &--size-large {
    --b-button-padding: 12px;
    --b-button-font-size: 15px;
    --b-button-icon-size: 16px;
    --b-button-height: 40px;
  }

  &--custom-color {
    --at-apply: hover:opacity-80;
  }

  &--strong {
    --at-apply: fw-800;
  }

}
</style>
