<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import 'uno.css'
import { apperance, isShowTopbar } from '~/logic/storage'
import { language } from '~/logic'
import '~/styles/index.ts'
import Home from './home/Home.vue'

// const [show, toggle] = useToggle(false)

const [showSettings, toggle] = useToggle(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <!-- <div class="fixed right-0 bottom-0 m-5 z-100 flex font-sans select-none leading-1em">
    <div
      class="bg-white text-gray-800 rounded-full shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      Vitesse WebExt 323143214214
    </div>
    <div
      class="flex w-10 h-10 rounded-full shadow cursor-pointer"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
      <pixelarticons-power class="block m-auto text-white text-lg" />
    </div>
  </div> -->
  <Transition>
    <Topbar v-show="isShowTopbar" class="fixed z-50" />
  </Transition>
  <!-- is home page -->
  <Home />
  <!-- button -->
  <div
    flex="~ col"
    pos="fixed bottom-5 lg:right-5 <lg:right-3"
  >
    <button
      class="transform active:scale-90"
      w="lg:45px <lg:40px"
      h="lg:45px <lg:40px"
      p="lg:3 <lg:2"
      m="b-3"
      bg="$bew-content-1"
      text="2xl $bew-text-1"
      font="leading-0"
      duration="300"
      rounded="$bew-radius"
      style="box-shadow: var(--bew-shadow-2); backdrop-filter: var(--bew-filter-glass);"
      @click="toggleDark()"
    >
      <tabler:moon-stars v-if="isDark" />
      <tabler:sun v-else />
    </button>

    <button
      class="leading-none transform active:scale-90"
      w="lg:45px <lg:40px"
      h="lg:45px <lg:40px"
      p="lg:3 <lg:2"
      bg="$bew-content-1"
      text="2xl $bew-text-1"
      font="leading-0"
      duration="300"
      rounded="$bew-radius"
      style="box-shadow: var(--bew-shadow-2); backdrop-filter: var(--bew-filter-glass);"
      @click="toggle()"
    >
      <tabler:settings />
    </button>
  </div>
  <Settings v-if="showSettings" @close="showSettings = false" />
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0 transform -translate-y-full;
}
</style>
