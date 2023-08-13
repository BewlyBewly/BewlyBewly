<script lang="ts" setup>
import type { Ref } from 'vue'

interface Props {
  min?: number
  max?: number
  value: number
  label: string
}
const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
})

const emit = defineEmits(['update:value'])

const modelValue = ref<number>(props.value)
const rangeRef = ref<HTMLElement>() as Ref<HTMLElement>

onMounted(() => {
  modelValue.value = props.value
  const progress = (modelValue.value / rangeRef.value!.max) * 100

  rangeRef.value.style.background = `linear-gradient(to right, var(--bew-theme-color) ${progress}%, var(--bew-fill-1) ${progress}%) no-repeat`

  if (rangeRef.value) {
    rangeRef.value.addEventListener('input', (event: Event) => {
      const tempSliderValue = event.target!.value
      emit('update:value', tempSliderValue)

      const progress = (tempSliderValue / rangeRef.value!.max) * 100

      rangeRef.value.style.background = `linear-gradient(to right, var(--bew-theme-color) ${progress}%, var(--bew-fill-1) ${progress}%) no-repeat`
    })
  }
})
</script>

<template>
  <label cursor-pointer flex items-center gap-3 w="$b-slider-width">
    <input
      ref="rangeRef"
      type="range" :min="min" :max="max" :value="value" class="slider" appearance-none outline-none bg="$bew-fill-1" rounded="$b-slider-height"
      border="size-$b-border-width color-$bew-border-color" w="$b-slider-width" h="$b-slider-height"
    >
    <span>{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
label {
  --b-border-width: 2px;
  --b-slider-height: 10px;
  --b-slider-width: 100%;
  --b-thumb-width: calc(20px - var(--b-border-width));
  --b-thumb-height:  calc(20px - var(--b-border-width));
}

input[type="range"] {
  &::-webkit-slider-thumb {
    --at-apply: appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height
      border-2 border-$bew-border-color cursor-pointer;
  }

  &::-webkit-slider-thumb:hover {
    --at-apply: border-$bew-theme-color;
  }

  &::-moz-range-thumb {
    --at-apply: appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height
      border-2 border-$bew-border-color cursor-pointer;
  }

  &::-moz-range-thumb:hover {
    --at-apply: border-$bew-theme-color;
  }
}
</style>
