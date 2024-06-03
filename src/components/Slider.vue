<script lang="ts" setup>
import type { Ref } from 'vue'

interface Props {
  min?: number
  max?: number
  modelValue: number
  label: string
}
const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
})

const emit = defineEmits(['update:modelValue'])

const modelValue = ref<number>(props.modelValue)
const rangeRef = ref<HTMLInputElement>() as Ref<HTMLInputElement>

onMounted(() => {
  modelValue.value = props.modelValue
  const progress = (modelValue.value / Number(rangeRef.value.max)) * 100

  rangeRef.value.style.background = `linear-gradient(to right, var(--bew-theme-color) ${progress}%, var(--bew-fill-1) ${progress}%) no-repeat`

  if (rangeRef.value) {
    rangeRef.value.addEventListener('input', (event: Event) => {
      const tempSliderValue = Number((event.target as HTMLInputElement).value)
      emit('update:modelValue', Number(tempSliderValue))

      const progress = (tempSliderValue / Number(rangeRef.value.max)) * 100

      rangeRef.value.style.background = `linear-gradient(to right, var(--bew-theme-color) ${progress}%, var(--bew-fill-1) ${progress}%) no-repeat`
    })
  }
})
</script>

<template>
  <label cursor-pointer flex items-center gap-3 w="$b-slider-width">
    <input
      ref="rangeRef"
      v-model="modelValue" type="range" :min="min" :max="max" class="slider"
      appearance-none outline-none bg="$bew-fill-1" rounded="$b-slider-height"
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
  --b-thumb-height: calc(20px - var(--b-border-width));
}

input[type="range"] {
  &::-webkit-slider-thumb {
    --uno: "appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height";
    --uno: "ring-$bew-border-color ring-2 cursor-pointer duration-300";
  }

  &::-webkit-slider-thumb:hover {
    --uno: "ring-$bew-theme-color";
  }

  &::-moz-range-thumb {
    --uno: "appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height";
    --uno: "ring-$bew-border-color ring-2 cursor-pointer duration-300";
  }

  &::-moz-range-thumb:hover {
    --uno: "ring-$bew-theme-color";
  }
}
</style>
