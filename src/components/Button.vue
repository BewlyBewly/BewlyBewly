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
      '--b-radius': round ? '50px' : '',
      'width': block ? '100%' : 'unset',
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
  --b-color: var(--bew-content-solid-1);
  --b-color-hover: var(--bew-content-solid-1-hover);
  --b-text-color: var(--bew-text-1);
  --b-radius: var(--bew-radius);
  --b-padding: 0 14px;
  --b-font-size: 14px;
  --b-icon-size: 15px;
  --b-line-height: 35px;

  --at-apply: bg-$b-color hover:bg-$b-color-hover
    rounded-$b-radius p-$b-padding transform-gpu active:scale-95
    duration-300 flex items-center gap-2 text-size-$b-font-size
    text-$b-text-color lh-$b-line-height;

    & svg {
      --at-apply: text-size-$b-icon-size
    }

    &.frosted-glass {
      --b-color: var(--bew-content-1);
      --b-color-hover: var(--bew-content-1-hover);
      backdrop-filter: var(--bew-filter-glass);
    }

  &--type-default {
  }

  &--type-primary {
    --b-color: var(--bew-theme-color);
    --b-color-hover: var(--bew-theme-color);
    --b-text-color: white;
  }

  &--type-secondary {
    --b-color: var(--bew-fill-1);
    --b-color-hover: var(--bew-fill-2);
    --b-text-color: var(--bew-text-1);
  }

  &--type-error {
    --b-color: var(--bew-error-color);
    --b-color-hover: var(--bew-error-color)
    --b-text-color: white;
  }

  &--size-small {
    --b-padding: 6px 12px;
    --b-font-size: 14px;
    --b-icon-size: 14px;
    --b-line-height: 30px;
  }

  &--size-large {
    --b-padding: 12px 16px;
    --b-font-size: 15px;
    --b-icon-size: 16px;
    --b-line-height: 40px;
  }

  &--custom-color {
    --at-apply: hover:opacity-80;
  }

  &--strong {
    --at-apply: fw-800;
  }

}
</style>
