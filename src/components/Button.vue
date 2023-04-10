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
  frosted?: boolean
}

// const props = withDefaults(defineProps<Props>(), {})
const props = defineProps<Props>()

const emit = defineEmits(['click'])

const handleClick = (evt: MouseEvent) => {
  emit('click', evt)
}
</script>

<template>
  <button
    class="b-button"
    :class="`
      b-button--type-${props.type ?? 'default'}
      b-button--size-${props.size ?? 'medium'}
      ${props.frosted ? 'frosted-glass' : ''}
    `"
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
  --b-padding: 10px 14px;
  --b-font-size: 14px;
  --b-icon-size: 15px;

  --at-apply: bg-$b-color hover:bg-$b-color-hover
    rounded-$b-radius p-$b-padding transform-gpu active:scale-95
    duration-300 flex items-center gap-2 text-size-$b-font-size
    text-$b-text-color;

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

  &--type-error {
    --b-color: var(--bew-error-color);
    --b-color-hover: var(--bew-error-color)
    --b-text-color: white;
  }

  &--size-small {
    --b-padding: 6px 12px;
    --b-font-size: 14px;
    --b-icon-size: 14px;
  }

  &--size-large {
    --b-padding: 12px 16px;
    --b-font-size: 15px;
    --b-icon-size: 16px;
  }
}
</style>
