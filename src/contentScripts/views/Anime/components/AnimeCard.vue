<script setup lang="ts">
import { removeHttpFromUrl } from '~/utils/main'

defineProps<{
  url: string
  cover: string
  title: string
  desc: string
  capsuleText: string
  rank?: number
}>()
</script>

<template>
  <div>
    <a
      rounded="$bew-radius" aspect="12/16" overflow-hidden mb-4 bg="$bew-fill-3" relative
      :href="url" target="_blank"
    >
      <div
        v-if="rank"
        w-full
        pos="absolute bottom-0"
        text="white 7xl shadow-xl"
        px-2
        fw-bold
        h-150px
        flex
        items-end
        bg="gradient-to-b gradient-from-transparent gradient-to-[rgba(0,0,0,.6)]"
        rounded-b="$bew-radius"
      >
        {{ rank }}
      </div>
      <img
        :src="`${removeHttpFromUrl(cover)}@466w_622h.webp`"
        :alt="title"
        rounded="$bew-radius" aspect="12/16"
      >
    </a>
    <p un-text="lg" my-4>
      <a
        :href="url"
        target="_blank"
        class="keep-two-lines"
        :title="title"
      >
        {{ title }}
      </a>
    </p>
    <div text="$bew-text-2" mb-10 flex items-center>
      <div
        text="$bew-theme-color" bg="$bew-theme-color-20"
        p="x-3" h-27px lh-27px mr-2 rounded-4
      >
        {{ capsuleText }}
      </div>
      {{ desc }}
    </div>
  </div>
</template>
