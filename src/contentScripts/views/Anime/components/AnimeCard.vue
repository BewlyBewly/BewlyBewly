<script setup lang="ts">
import { removeHttpFromUrl } from '~/utils/main'

defineProps<{
  url: string
  cover: string
  coverHover?: string
  tags?: string[]
  title: string
  desc: string
  capsuleText?: string
  rank?: number
}>()
</script>

<template>
  <div>
    <a
      rounded="$bew-radius" w-full aspect="12/16" overflow-hidden mb-4 bg="$bew-fill-3" relative
      class="group"
      :href="url" target="_blank" tabindex="-1"
    >
      <div
        v-if="rank"
        w-full
        pos="absolute bottom-0"
        text="white 7xl shadow-xl"
        px-2 fw-bold h-150px flex items-end
        bg="gradient-to-b gradient-from-transparent gradient-to-[rgba(0,0,0,.6)]"
        rounded-b="$bew-radius"
      >
        {{ rank }}
      </div>

      <div
        overflow-hidden
        rounded="$bew-radius"
        aspect="12/16"
        mb-4
        pos="relative"
        bg="$bew-fill-3"
      >

        <!-- anime genres -->
        <!-- <div
          v-if="tags && tags?.length > 0"
          pos="absolute bottom-0" w-full h-180px flex items-end z-1
          opacity="0 group-hover:100"
          transform="~ translate-y-4 group-hover:translate-y-0"
          transition="all duration-300"
          style="
          background: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.6)
          );
        "
        >
          <div flex="~ wrap" gap-2 p-2>
            <span
              v-for="tag in tags"
              :key="tag"
              bg="white opacity-30"
              text="white sm"
              leading-none
              p="x-2 y-1"
              rounded="$bew-radius-half"
              shrink-0
            >{{ tag }}</span>
          </div>
        </div> -->

        <img
          :src="`${removeHttpFromUrl(cover)}@466w_622h.webp`"
          :alt="title"
          rounded="$bew-radius" aspect="12/16"
        >

        <!-- image after hovering -->
        <!-- <div
          v-if="coverHover"
          w-full
          rounded="$bew-radius"
          aspect="12/16"
          transform="~ scale-120 group-hover:scale-100"
          transition="all duration-1000"
          bg="cover center"
          pos="absolute top-0 left-0"
          :style="{
            backgroundImage: `url(${removeHttpFromUrl(
              coverHover || cover,
            )}@672w_378h_1c.webp)`,
          }"
          style="
          transition-timing-function: cubic-bezier(
            0.22,
            0.61,
            0.36,
            1
          );
        "
        /> -->
      </div>
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
    <div text="$bew-text-2" mb-10 flex flex-wrap gap-2 items-center>
      <div
        v-if="capsuleText"
        text="$bew-theme-color" bg="$bew-theme-color-20"
        p="x-3" h-27px lh-27px rounded-4
      >
        {{ capsuleText }}
      </div>
      <span> {{ desc }} </span>
    </div>
  </div>
</template>
