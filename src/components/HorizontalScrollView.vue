<script setup lang="ts">
import type { Ref } from 'vue'

const scrollListWrap = ref<HTMLElement>() as Ref<HTMLElement>
const showLeftMask = ref<boolean>(false)
const showRightMask = ref<boolean>(false)

onMounted(() => {
  scrollListWrap.value.addEventListener('scroll', () => {
    if (scrollListWrap.value.scrollLeft > 0) {
      showLeftMask.value = true
      showRightMask.value = true
    }
    else {
      showLeftMask.value = false
      showRightMask.value = false
    }

    if (
      scrollListWrap.value.scrollLeft + scrollListWrap.value.clientWidth
      >= scrollListWrap.value.scrollWidth
    ) {
      showLeftMask.value = false
      showRightMask.value = false
    }
  })
  scrollListWrap.value.addEventListener('wheel', (event: WheelEvent) => {
    event.preventDefault()
    scrollListWrap.value.scrollLeft += event.deltaY
  })
})
</script>

<template>
  <div relative>
    <transition name="fade">
      <div
        v-show="showLeftMask"
        h-full
        w-80px
        absolute
        z-1
        style="background: linear-gradient(to left, transparent, var(--bew-bg))"
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
    </transition>

    <div
      ref="scrollListWrap"
      w-full
      overflow-x-scroll
      overflow-y-hidden
      relative
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  --at-apply: opacity-0;
}
</style>
