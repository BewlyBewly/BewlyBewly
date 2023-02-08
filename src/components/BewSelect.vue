<script lang="ts">
// TODO: refactor to composition api

// import { useI18n } from 'vue-i18n'
// const { locale } = useI18n()

interface OptionType {
  value: string
  label: string
}

export default defineComponent({
  props: {
    modelValue: String,
    options: Array as () => OptionType[],
  },
  emits: ['update:modelValue'],
  data() {
    return {
      label: '' as string,
      showOptions: false as boolean,
    }
  },
  // watch: {
  //   locale(newValue) {
  //     console.log(newValue)
  //     this.$forceUpdate()
  //   },
  // },
  created() {
    if (!this.options)
      return
    this.label = `${this.options.find((item: OptionType) => item.value === this.modelValue)?.label}`
  },
  methods: {
    onClickOption(val: { value: string; label: string }) {
      window.removeEventListener('click', () => {})
      this.label = val.label
      this.$emit('update:modelValue', val.value)
      this.showOptions = false
    },
    closeOptions() {
      this.showOptions = false
    },
    /** when you click on it outside, the selection option will be turned off  */
    onMouseLeave() {
      window.addEventListener('click', this.closeOptions)
    },
    onMouseEnter() {
      window.removeEventListener('click', this.closeOptions)
    },
  },
})
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
        text="space-nowrap overflow-ellipsis"
        overflow="hidden"
        m="r-2"
      >
        {{ label }}
      </div>

      <!-- arrow -->
      <div
        border="~ solid $bew-text-1 t-0 l-0 r-2 b-2"
        p="3px"
        m="l-2"
        display="inline-block"
        transform="~ rotate-45 -translate-y-1/4"
        transition="all duration-300"
      />
    </div>
    <transition>
      <div
        v-if="showOptions"
        pos="absolute"
        bg="$bew-content-1"
        style="backdrop-filter: var(--bew-filter-glass); box-shadow: var(--bew-shadow-2);"
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
