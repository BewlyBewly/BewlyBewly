<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large'
interface Props {
  modelValue: string
  size?: Size
}
const props = withDefaults(defineProps<Props>(), { size: 'medium' })

defineEmits(['update:modelValue', 'enter'])

const modelValue = ref<string>('')

onMounted(() => {
  modelValue.value = props.modelValue
})
</script>

<template>
  <input
    v-model="modelValue" type="text" class="b-input"
    p="x-4 y-2"
    rounded="$bew-radius" outline-none transition-all duration-300
    bg="$bew-fill-1"
    focus:shadow focus:ring="2px $bew-theme-color"
    @input="$emit('update:modelValue', $event!.target!.value)"
    @keydown.enter="$emit('enter')"
  >
</template>

<style lang="scss" scoped>

</style>
