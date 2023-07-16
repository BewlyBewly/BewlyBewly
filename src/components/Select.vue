<script setup lang="ts">
const props = defineProps<{
  options: OptionType[]
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

interface OptionType {
  value: string
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

function onClickOption(val: { value: string; label: string }) {
  window.removeEventListener('click', () => {})
  label.value = val.label
  emit('update:modelValue', val.value)
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
    w="full"
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
      items="center"
      @click="showOptions = !showOptions"
    >
      <div
        truncate
        overflow="hidden"
        m="r-2"
        v-text="label"
      />

      <!-- arrow -->
      <div
        border="~ solid $bew-text-1 t-0 l-0 r-2 b-2"
        p="3px"
        m="l-2"
        display="inline-block"
        :transform="`~ ${!showOptions ? 'rotate-45 -translate-y-1/4' : 'rotate-225 translate-y-1/4'} `"
        transition="all duration-300"
      />
    </div>
    <transition>
      <div
        v-if="showOptions"
        pos="absolute"
        bg="$bew-elevated-2"
        backdrop-glass shadow="$bew-shadow-2"
        p="2"
        m="t-2"
        rounded="$bew-radius"
        z="1"
        w="full"
      >
        <div
          v-for="option in options"
          :key="option.value"
          p="2"
          m="not-last:b-1"
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
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  --at-apply: transition-all duration-500;
}

.v-enter-from,
.v-leave-to {
  --at-apply: opacity-0 transform-gpu scale-95 -translate-y-4 filter blur-sm;
}
</style>
