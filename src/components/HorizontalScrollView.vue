<script setup lang="ts">
import type { Ref } from 'vue'

import { settings } from '~/logic'

const scrollListWrap = ref<HTMLElement>() as Ref<HTMLElement>
// const showLeftMask = ref<boolean>(false)
// const showRightMask = ref<boolean>(false)
const showScrollMask = ref<boolean>(true)

watch([() => settings.value.enableHorizontalScrolling, scrollListWrap], ([enableHorizontalScrolling, scrollListWrap]) => {
  if (!scrollListWrap)
    return

  if (enableHorizontalScrolling)
    scrollListWrap.addEventListener('wheel', handleMouseScroll)
  else
    scrollListWrap.removeEventListener('wheel', handleMouseScroll)
})

onMounted(() => {
  // scrollListWrap.value.addEventListener('scroll', () => {
  //   if (scrollListWrap.value.scrollLeft > 0)
  //     showScrollMask.value = true

  //   else
  //     showScrollMask.value = false

  //   if (
  //     scrollListWrap.value.scrollLeft + scrollListWrap.value.clientWidth
  //     >= scrollListWrap.value.scrollWidth - 20
  //   )
  //     showScrollMask.value = false
  // })
})

function handleMouseScroll(event: WheelEvent) {
  event.preventDefault()
  scrollListWrap.value.scrollLeft += event.deltaY
}
</script>

<template>
  <div relative>
    <!-- <transition name="fade">
      <div
        v-show="showLeftMask"
        h-full
        w-80px
        absolute
        z-1
        style="mask-image: linear-gradient(to left, transparent, black); mask-mode: alpha;"
      />
    </transition>
    <transition name="fade">
      <div
        v-show="showRightMask"
        h-full
        w-80px
        pos="absolute right-0"
        z-1
        style="
          background: linear-gradient(to right, transparent, var(--bew-bg));
        "
      />
    </transition> -->

    <div
      ref="scrollListWrap"
      w="[calc(100%+80px)]"
      h="[calc(100%+40px)]"
      m="x--40px y--20px" p="x-40px y-20px"
      overflow-x-scroll
      overflow-y-hidden
      relative
      :class="{ 'scroll-mask': showScrollMask }"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-mask {
  mask-image: linear-gradient(to right, transparent 0%, black 40px calc(100% - 40px), transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 40px calc(100% - 40px), transparent 100%);
}
</style>
