<script lang="ts" setup>
const props = defineProps<{
  value: boolean
  label?: string
}>()

const emit = defineEmits(['update:value'])

const modelValue = ref<boolean>()

watch(() => modelValue.value, (newValue) => {
  emit('update:value', newValue)
})

onMounted(() => {
  modelValue.value = props.value
})
</script>

<template>
  <label cursor="pointer" pointer="auto" flex items-center gap-3>
    <input v-model="modelValue" type="checkbox" hidden>
    <span
      inline-block w="$b-button-width" h="$b-button-height" bg="$bew-fill-1" rounded="[calc(var(--b-button-height)/2)]"
      relative duration="~ 300 ease-in-out" border="size-$b-border-width color-$bew-fill-1"
      after:content-none after:inline-block after:bg="white" after:rounded="[calc(var(--b-button-height)/2)]"
      after:w="[calc(var(--b-button-height)-var(--b-border-width))]" after:h="[calc(var(--b-button-height)-var(--b-border-width))]"
      after:border="size-$b-border-width color-$bew-fill-1"
      after:pos="absolute top-[calc(0px-var(--b-border-width)/2)]" after:duration="~ 300 ease-in-out"
    />
    <span>{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
label {
  --b-button-width: 50px;
  --b-button-height: 25px;
  --b-border-width: 2px;
}

input[type="checkbox"]:checked + span {
  --at-apply: bg-$bew-theme-color-70 border-$bew-theme-color;
}

input[type="checkbox"]:checked + span::after {
  --at-apply: border-$bew-theme-color translate-x-full;
}
</style>
