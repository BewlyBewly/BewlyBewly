<script setup lang="ts">
const props = defineProps<{
  options: OptionType[]
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue', 'change'])

interface OptionType {
  value: any
  label: string
}

const label = ref<string>('')
const showOptions = ref<boolean>(false)

onUpdated(() => {
  // fix the issue when the dropdown menu text doesn't update in real-time based on the updated page language
  if (props.options)
    label.value = `${props.options.find((item: OptionType) => item.value === props.modelValue)?.label}`
})

onMounted(() => {
  if (props.options)
    label.value = `${props.options.find((item: OptionType) => item.value === props.modelValue)?.label}`
})

function onClickOption(val: OptionType) {
  window.removeEventListener('click', () => {})
  label.value = val.label
  emit('update:modelValue', val.value)
  emit('change', val)
  showOptions.value = false
}

function closeOptions() {
  showOptions.value = false
}

/** when you click on it outside, the selection option will be turned off  */
function onMouseLeave() {
  window.addEventListener('click', closeOptions)
}

function onMouseEnter() {
  window.removeEventListener('click', closeOptions)
}
</script>

<template>
  <div
    pos="relative"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
  >
    <div
      p="x-4 y-2"
      bg="$bew-fill-1"
      rounded="$bew-radius"
      text="center $bew-text-1"
      cursor="pointer"
      flex="~"
      justify="between"
      items="center" w="full"
      :ring="showOptions ? '2px $bew-theme-color' : ''" duration-300
      @click="showOptions = !showOptions"
    >
      <div
        truncate
        overflow="hidden"
        m="r-2"
        v-text="label === 'undefined' ? '' : label"
      />

      <!-- arrow -->
      <div
        border="~ solid t-0 l-0 r-2 b-2"
        :border-color="showOptions ? '$bew-theme-color' : '$bew-fill-4'"
        p="3px"
        m="l-2"
        display="inline-block"
        :transform="`~ ${!showOptions ? 'rotate-45 -translate-y-1/4' : 'rotate-225 translate-y-1/4'} `"
        transition="all duration-300"
      />
    </div>
    <Transition>
      <div
        v-if="showOptions"
        style="backdrop-filter: var(--bew-filter-glass-1)"
        pos="absolute" bg="$bew-elevated-2" shadow="$bew-shadow-2" p="2"
        m="t-2"
        rounded="$bew-radius" z="1" flex="~ col gap-1"
        w="full" max-h-300px overflow-y-overlay will-change-transform transform-gpu
      >
        <div
          v-for="option in options"
          :key="option.value"
          p="x-2 y-2"
          rounded="$bew-radius"
          w="full"
          bg="hover:$bew-fill-2"
          transition="all duration-300"
          cursor="pointer"
          @click="onClickOption(option)"
        >
          <span v-text="option.label" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  --uno: "transition-all duration-340 transform-gpu";
}

.v-enter-from,
.v-leave-to {
  --uno: "opacity-0 transform-gpu scale-95 -translate-y-4 filter blur-sm";
}
</style>
