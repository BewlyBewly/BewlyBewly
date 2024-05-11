<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import Empty from '~/components/Empty.vue'
import Loading from '~/components/Loading.vue'
import Progress from '~/components/Progress.vue'
import { useApiClient } from '~/composables/api'
import type { List as VideoItem, WatchLaterResult } from '~/models/video/watchLater'
import { calcCurrentTime } from '~/utils/dataFormatter'
import { isHomePage, removeHttpFromUrl } from '~/utils/main'

const api = useApiClient()
const watchLaterList = reactive<VideoItem[]>([])
const isLoading = ref<boolean>()
const viewAllUrl = computed((): string => {
  return 'https://www.bilibili.com/watchlater/#/list'
})
const playAllUrl = computed((): string => {
  return 'https://www.bilibili.com/list/watchlater'
})

onMounted(() => {
  getAllWatchLaterList()
})

/**
 * Return the URL of the watch later item
 * @param bvid bvid
 * @return {string} url
 */
function getWatchLaterUrl(bvid: string): string {
  return `https://www.bilibili.com/list/watchlater?bvid=${bvid}`
}

/**
 * Get watch later list
 */
function getAllWatchLaterList() {
  isLoading.value = true
  watchLaterList.length = 0

  api.watchlater.getAllWatchLaterList()
    .then((res: WatchLaterResult) => {
      if (res.code === 0)
        Object.assign(watchLaterList, res.data.list)

      isLoading.value = false
    })
}
</script>

<template>
  <div
    w="380px"
    shadow="$bew-shadow-2"
    bg="$bew-elevated-solid-1"
    rounded="$bew-radius"
    pos="relative"
    of="hidden"
  >
    <!-- top bar -->
    <header
      style="backdrop-filter: var(--bew-filter-glass-1);"
      flex="~"
      justify="between"
      p="y-4 x-6"
      pos="fixed top-0 left-0"
      w="full"
      bg="$bew-elevated-1"
      z="2"
      border="!rounded-t-$bew-radius"
    >
      <div flex="~">
        <div>
          {{ $t('topbar.watch_later') }}
        </div>
      </div>

      <div flex="~ gap-4">
        <a
          :href="playAllUrl" :target="isHomePage() ? '_blank' : '_self'" rel="noopener noreferrer"
          flex="~" items="center"
        >
          <span text="sm">{{ $t('common.play_all') }}</span>
        </a>
        <a
          :href="viewAllUrl" :target="isHomePage() ? '_blank' : '_self'" rel="noopener noreferrer"
          flex="~" items="center"
        >
          <span text="sm">{{ $t('common.view_all') }}</span>
        </a>
      </div>
    </header>

    <!-- watchLater wrapper -->
    <main overflow-hidden rounded="$bew-radius">
      <div
        flex="~ col gap-2"
        h="430px"
        overflow="y-scroll"
        p="x-4"
      >
        <!-- loading -->
        <Loading
          v-if="isLoading && watchLaterList.length === 0"
          h="full"
          flex="~"
          items="center"
        />

        <!-- empty -->
        <Empty
          v-if="!isLoading && watchLaterList.length === 0"
          pos="absolute top-0 left-0"
          bg="$bew-content-1"
          z="0" w="full" h="full"
          flex="~ items-center"
        />

        <!-- watchlater -->
        <TransitionGroup name="list">
          <a
            v-for="item in watchLaterList"
            :key="item.aid"
            :href="getWatchLaterUrl(item.bvid)" :target="isHomePage() ? '_blank' : '_self'" rel="noopener noreferrer"
            m="last:b-4 first:t-50px" p="2"
            rounded="$bew-radius"
            hover:bg="$bew-fill-2"
            duration-300
          >
            <section flex="~ gap-4 item-start">
              <!-- Video cover, live cover, ariticle cover -->
              <div
                bg="$bew-fill-1"
                w="150px"
                flex="shrink-0"
                border="rounded-$bew-radius-half"
                overflow="hidden"
              >
                <!-- Video -->
                <div pos="relative">
                  <img
                    w="150px" h-full
                    class="aspect-video"
                    :src="`${removeHttpFromUrl(
                      item.pic,
                    )}@256w_144h_1c`"
                    :alt="item.title"
                    object-cover
                  >
                  <div
                    pos="absolute bottom-0 right-0"
                    bg="black opacity-60"
                    m="1"
                    p="x-2 y-1"
                    text="white xs"
                    border="rounded-full"
                  >
                    <!--  When progress = -1 means that the user watched the full video -->
                    {{
                      `${
                        item.progress === -1
                          ? calcCurrentTime(item.duration)
                          : calcCurrentTime(item.progress)
                      } /
                    ${calcCurrentTime(item.duration)}`
                    }}
                  </div>
                </div>
                <Progress
                  :percentage="
                    (item.progress / item.duration) * 100
                  "
                />

              </div>

              <!-- Description -->
              <div>
                <h3
                  class="keep-two-lines"
                  overflow="hidden"
                  text="ellipsis"
                  break-anywhere
                >
                  {{ item.title }}
                </h3>
                <div text="$bew-text-2 sm" m="t-4" flex="~" align="items-center">
                  {{ item.owner.name }}

                </div>
              </div>
            </section>
          </a>
        </TransitionGroup>

        <!-- loading -->
        <Transition name="fade">
          <Loading v-if="isLoading && watchLaterList.length !== 0" m="-t-4" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  --at-apply: relative text-$bew-text-2;

  &::after {
    --at-apply: absolute bottom-0 left-0 w-full h-12px bg-$bew-theme-color
      opacity-0 transform scale-x-0 -z-1 transition-all duration-300;
    content: '';
  }
}

.tab-selected {
  --at-apply: font-bold text-$bew-text-1;

  &::after {
    --at-apply: scale-x-80 opacity-40;
  }
}
</style>
