<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  label?: string
}>()

const model = defineModel()
</script>

<template>
  <label cursor="pointer" pointer="auto" flex items-center gap-3>
    <span>{{ label }}</span>
    <input v-model="model" type="checkbox" hidden>
    <span
      inline-block w="$b-button-width" h="$b-button-height" bg="$bew-fill-1" rounded="[calc(var(--b-button-height)/2)]"
      relative border="size-$b-border-width color-$bew-border-color"
      after:content-empty after:inline-block after:bg-white after:rounded="[calc(var(--b-button-height)/2)]"
      after:w="[calc(var(--b-button-height)-var(--b-border-width))]" after:h="[calc(var(--b-button-height)-var(--b-border-width))]"
      after:border="size-$b-border-width color-$bew-border-color"
      after:pos="absolute top-[calc(0px-var(--b-border-width)/2)]"
    />
  </label>
</template>

<style lang="scss" scoped>
label {
  --b-button-width: 50px;
  --b-button-height: 25px;
  --b-border-width: 2px;
}

input[type="checkbox"] + span::after {
  box-sizing: border-box;
}

input[type="checkbox"]{

  &:hover + span {
    --at-apply: bg-$bew-fill-2;
  }

  &:active + span::after {
    --at-apply: scale-90;
  }

  &:checked + span {
    --at-apply: bg-$bew-theme-color-60 border-$bew-theme-color;
  }

  &:checked:hover + span {
    --at-apply: bg-$bew-theme-color-80 border-$bew-theme-color;
    box-shadow: 0 0 6px 2px var(--bew-theme-color-40), inset 0 0 6px var(--bew-theme-color-30);
  }

  & + span,
  & + span::after {
    transition: .3s cubic-bezier(.25,.15,.29,1.51);
  }

  &:checked + span::after {
    --at-apply: border-$bew-theme-color translate-x-full;
  }
}
</style>
