<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large'
interface Props {
  modelValue: string
  size?: Size
  type?: 'text' | 'password' | 'email' | 'number'
  min?: number
  max?: number
}
const props = withDefaults(defineProps<Props>(), { size: 'medium' })

defineEmits(['update:modelValue', 'enter'])

const modelValue = ref<string>('')

onMounted(() => {
  modelValue.value = props.modelValue
})
</script>

<template>
  <div
    focus-within:ring="2px $bew-theme-color"
    p="x-4 y-2"
    rounded="$bew-radius" transition-all duration-300
    bg="$bew-fill-1" flex="~ gap-2"
  >
    <slot name="prefix" />
    <input
      v-model="modelValue" :type="type" :min="min" :max="max"
      outline-none flex-1
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('enter')"
    >
    <slot name="suffix" />
  </div>
</template>

<style lang="scss" scoped>

</style>
