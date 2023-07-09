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
    p="x-4 y-2" border="2px $bew-fill-2 focus:$bew-theme-color" rounded="$bew-radius" outline-none
    duration bg="$bew-content-solid-1"
    @input="$emit('update:value', $event!.target!.value)"
  >
</template>

<style lang="scss" scoped>

</style>
