<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large'
interface Props {
  value: string
  size?: Size
}
const props = withDefaults(defineProps<Props>(), { size: 'medium' })

defineEmits(['update:value'])

const modelValue = ref<string>('')

onMounted(() => {
  modelValue.value = props.value
})
</script>

<template>
  <input
    v-model="modelValue" type="text" class="b-input"
    p="x-4 y-2" border="1px transparent focus:$bew-theme-color"
    rounded="$bew-radius" outline-none transition-all duration-300
    bg="$bew-fill-1"
    focus:shadow focus:ring="2px $bew-theme-color"

    @input="$emit('update:value', $event!.target!.value)"
  >
</template>

<style lang="scss" scoped>

</style>
