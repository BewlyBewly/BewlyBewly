<script setup lang="ts">
import { useDark } from '~/composables/useDark'
import { numFormatter } from '~/utils/dataFormatter'
import { removeHttpFromUrl } from '~/utils/main'

import BangumiCardSkeleton from './BangumiCardSkeleton.vue'

defineProps<{
  skeleton?: boolean
  bangumi: Bangumi
  horizontal?: boolean
}>()

interface Bangumi {
  url: string
  cover: string
  coverHover?: string
  tags?: string[]
  title: string
  desc: string
  evaluate?: string
  capsuleText?: string
  rank?: number
  view?: number
  follow?: number
  badge?: {
    text: string
    bgColor: string
    bgColorDark: string
  }
}

const { isDark } = useDark()
</script>

<template>
  <div mb-6>
    <a
      v-if="!skeleton && bangumi"
      class="group"
      :style="{
        display: horizontal ? 'flex' : 'block',
      }"
      :href="bangumi.url" target="_blank" rel="noopener noreferrer"
      gap-4 hover:bg="$bew-fill-2" hover:ring="8 $bew-fill-2"
      content-visibility-auto intrinsic-size-400px
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
          <!-- badge -->
          <div
            v-if="bangumi.badge"
            :style="{
              backgroundColor: isDark ? bangumi.badge.bgColorDark : bangumi.badge.bgColor,
            }"
            pos="absolute top-0 right-0"
            p="x-2 y-1" m-1 rounded="$bew-radius"
            opacity-100 group-hover:opacity-0 duration-300
            text="sm white" z-1
          >
            {{ bangumi.badge.text }}
          </div>

          <!-- rank -->
          <div
            v-if="bangumi.rank"
            w-full
            pos="absolute bottom-0" z-1
            text="white 7xl shadow"
            p-2 fw-bold h-150px flex items-end
            bg="gradient-to-b gradient-from-transparent gradient-to-[rgba(0,0,0,.6)]"
            rounded-b="$bew-radius"
            :style="{
              '--un-text-shadow': bangumi.rank <= 3 ? '4px 4px 0 var(--bew-theme-color), 6px 6px 0 var(--bew-theme-color-60)' : '',
            }"
          >
            {{ bangumi.rank }}
          </div>

          <div
            overflow-hidden
            rounded="$bew-radius"
            aspect="12/16"
            pos="relative"
          >

            <!-- anime genres -->
            <div
              v-if="bangumi.evaluate || (Array.isArray(bangumi.tags) && bangumi.tags?.length > 0)"
              pos="absolute bottom-0" w-full h-full p-2
              flex="~ col justify-end"
              opacity-0 group-hover:opacity-100
              transform="~ translate-y-4 group-hover:translate-y-0"
              transition="all duration-300"
              z-1
              style="
                background: linear-gradient(
                  transparent,
                  rgba(0, 0, 0, 0.8)
                );
              "
            >
              <div mb-4 text="white group-hover:shadow-[0_0_4px_rgba(0,0,0,1)]">{{ bangumi.evaluate }}</div>
              <template v-if="Array.isArray(bangumi.tags) && bangumi.tags?.length > 0">
                <div flex="~ wrap" gap-2>
                  <span
                    v-for="tag in bangumi.tags"
                    :key="tag"
                    bg="white opacity-30"
                    text="white sm"
                    leading-none
                    p="x-2 y-1"
                    rounded="$bew-radius-half"
                    shrink-0
                  >{{ tag }}
                  </span>
                </div>
              </template>
            </div>

            <img
              :src="`${removeHttpFromUrl(bangumi.cover)}@466w_622h.webp`"
              :alt="bangumi.title"
              rounded="$bew-radius" aspect="12/16" max-w-full w-full
            >

            <!-- image after hovering -->
            <div
              v-if="bangumi.coverHover"
              w-full
              rounded="$bew-radius"
              aspect="12/16"
              transform="~ scale-110 group-hover:scale-100"
              transition="all duration-340"
              bg="cover center"
              pos="absolute top-0 left-0"
              opacity-0 group-hover:opacity-100
              :style="{
                backgroundImage: `url(${removeHttpFromUrl(
                  bangumi.coverHover || bangumi.cover,
                )}@672w_378h_1c.webp)`,
              }"
              style="transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);"
            />
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
            :href="bangumi.url" target="_blank" rel="noopener noreferrer"
            class="keep-two-lines"
            :title="bangumi.title"
          >
            {{ bangumi.title }}
          </a>
        </p>
        <p v-if="bangumi.view || bangumi.follow" text="$bew-text-2" mb-2>
          <span v-if="bangumi.view" mr-4>{{ $t('common.view', { count: numFormatter(bangumi.view) }, bangumi.view) }}</span>
          <span v-if="bangumi.follow">{{ $t('common.anime_follow_count', { count: numFormatter(bangumi.follow) }, bangumi.follow) }}</span>
        </p>
        <div text="$bew-text-2" flex flex-wrap gap-2 items-center>
          <div
            v-if="bangumi.capsuleText"
            text="$bew-theme-color" bg="$bew-theme-color-20"
            p="x-3" h-27px lh-27px rounded-4
          >
            {{ bangumi.capsuleText }}
          </div>
          <span> {{ bangumi.desc }} </span>
        </div>
      </div>
    </a>
    <BangumiCardSkeleton
      v-else-if="skeleton"
      :horizontal="horizontal"
      important-mb-0
    />
  </div>
</template>
