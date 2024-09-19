<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large'
interface Props {
  size?: Size
  type?: 'text' | 'password' | 'email' | 'number'
  min?: number
  max?: number
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), { size: 'medium' })

defineEmits(['enter'])

const modelValue = defineModel<string | number>()

const inputRef = ref<HTMLInputElement | null>(null)

const height = computed(() => {
  if (props.size === 'small')
    return '30px'
  if (props.size === 'medium')
    return '35px'
  if (props.size === 'large')
    return '40px'
  return '35px'
})

const padding = computed(() => {
  if (props.size === 'small')
    return '0 calc(var(--bew-base-font-size) * 0.5)'
  return '0 var(--bew-base-font-size)'
})

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div
    :style="{ height, padding }"
    focus-within:ring="2px $bew-theme-color"
    p="x-4"
    rounded="$bew-radius" transition-all duration-300
    bg="$bew-fill-1" flex="~ gap-2"
  >
    <div v-if="$slots.prefix" class="prefix">
      <div>
        <slot name="prefix" />
      </div>
    </div>

    <input
      ref="inputRef"
      v-model="modelValue"
      :style="{ lineHeight: height }"
      :type="type"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      w-inherit h-inherit
      outline-none flex-1 bg-transparent
      @keydown.enter="$emit('enter')"
    >

    <div v-if="$slots.suffix" class="suffix">
      <div>
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.prefix,
.suffix {
  --uno: "flex items-center";
}
</style>
