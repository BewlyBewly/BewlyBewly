<script lang="ts" setup>
import type { Ref } from 'vue'

const rangeRef = ref<HTMLElement>() as Ref<HTMLElement>

onMounted(() => {
  if (rangeRef.value) {
    rangeRef.value.addEventListener('input', (event: Event) => {
      const tempSliderValue = event.target!.value
      // sliderValue.textContent = tempSliderValue

      const progress = (tempSliderValue / rangeRef.value!.max) * 100

      rangeRef.value.style.background = `linear-gradient(to right, var(--bew-theme-color) ${progress}%, var(--bew-fill-1) ${progress}%) no-repeat`
    })
  }
})
</script>

<template>
  <label cursor-pointer flex itemscope gap-3 w="$b-slider-width">
    <input
      ref="rangeRef"
      type="range" min="1" max="100" value="0" class="slider" appearance-none outline-none bg="$bew-fill-1" rounded="$b-slider-height"
      border="size-$b-border-width color-$bew-border-color" w="$b-slider-width" h="$b-slider-height"
    >
  </label>
</template>

<style lang="scss" scoped>
label {
  --b-border-width: 2px;
  --b-slider-height: 10px;
  --b-slider-width: 100%;
  --b-thumb-width: calc(25px - var(--b-border-width));
  --b-thumb-height:  calc(25px - var(--b-border-width));
}

input[type="range"] {
  &::-webkit-slider-thumb {
    --at-apply: appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height
      border-$bew-border-color;
  }
  &::-moz-range-thumb {
    --at-apply: appearance-none w-$b-thumb-height h-$b-thumb-height bg-white rounded-$b-thumb-height
      border-$bew-border-color;
  }
}
</style>
