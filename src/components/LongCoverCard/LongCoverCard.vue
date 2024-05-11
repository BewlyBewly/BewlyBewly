<script setup lang="ts">
import { numFormatter } from '~/utils/dataFormatter'
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
  view?: number
  follow?: number
  horizontal?: boolean
}>()
</script>

<template>
  <a
    class="group"
    :style="{
      display: horizontal ? 'flex' : 'block',
    }"
    :href="url" target="_blank" rel="noopener noreferrer"
    gap-4 hover:bg="$bew-fill-2" hover:ring="8 $bew-fill-2"
    transition="all ease-in-out 300"
    rounded="$bew-radius" h-fit
  >
    <!-- Cover -->
    <div
      :style="{ width: horizontal ? '170px' : '100%' }"
      tabindex="-1" block
      rounded="$bew-radius" w-full bg="$bew-fill-4" relative shrink-0
    >
      <div aspect="12/16" overflow-hidden rounded="$bew-radius">
        <div
          v-if="rank"
          w-full
          pos="absolute bottom-0" z-1
          text="white 7xl shadow"
          p-2 fw-bold h-150px flex items-end
          bg="gradient-to-b gradient-from-transparent gradient-to-[rgba(0,0,0,.6)]"
          rounded-b="$bew-radius"
          :style="{
            '--un-text-shadow': rank <= 3 ? '4px 4px 0 var(--bew-theme-color), 6px 6px 0 var(--bew-theme-color-60)' : '',
          }"
        >
          {{ rank }}
        </div>

        <div
          overflow-hidden
          rounded="$bew-radius"
          aspect="12/16"
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
            rounded="$bew-radius" aspect="12/16" max-w-full w-full
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
      </div>
    </div>
    <div
      flex-1
      :style="{
        marginTop: horizontal ? '0' : '1rem',
      }"
    >
      <p un-text="lg" mb-4>
        <a
          :href="url" target="_blank" rel="noopener noreferrer"
          class="keep-two-lines"
          :title="title"
        >
          {{ title }}
        </a>
      </p>
      <p v-if="view || follow" text="$bew-text-2" mb-2>
        <span v-if="view" mr-4>{{ $t('common.view', { count: numFormatter(view) }, view) }}</span>
        <span v-if="follow">{{ $t('common.anime_follow_count', { count: numFormatter(follow) }, follow) }}</span>
      </p>
      <div text="$bew-text-2" flex flex-wrap gap-2 items-center>
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
  </a>
</template>
