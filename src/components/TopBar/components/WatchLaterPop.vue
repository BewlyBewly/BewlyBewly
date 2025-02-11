<script setup lang="ts">
import Empty from '~/components/Empty.vue'
import Loading from '~/components/Loading.vue'
import Progress from '~/components/Progress.vue'
import type { List as VideoItem, WatchLaterResult } from '~/models/video/watchLater'
import api from '~/utils/api'
import { calcCurrentTime } from '~/utils/dataFormatter'
import { getCSRF, removeHttpFromUrl } from '~/utils/main'

const watchLaterList = reactive<VideoItem[]>([])
const isLoading = ref<boolean>()
const viewAllUrl = computed((): string => {
  return 'https://www.bilibili.com/watchlater/list'
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

function deleteWatchLaterItem(index: number, aid: number) {
  api.watchlater.removeFromWatchLater({
    aid,
    csrf: getCSRF(),
  })
    .then((res) => {
      if (res.code === 0) {
        watchLaterList.splice(index, 1)
      }
    })
}
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    h="[calc(100vh-100px)]" max-h-500px important-overflow-y-overlay
    bg="$bew-elevated"
    w="380px"
    rounded="$bew-radius"
    pos="relative"
    of="hidden"
    shadow="[var(--bew-shadow-edge-glow-1),var(--bew-shadow-3)]"
    border="1 $bew-border-color"
  >
    <!-- top bar -->
    <header
      style="backdrop-filter: var(--bew-filter-glass-1);"
      flex="~"
      justify="between"
      p="y-4 x-6"
      pos="sticky top-0 left-0"
      w="full"
      bg="$bew-elevated"
      z="2"
    >
      <div flex="~">
        <div>
          {{ $t('topbar.watch_later') }}
        </div>
      </div>

      <div flex="~ gap-4">
        <ALink
          :href="playAllUrl"
          type="topBar"
          flex="~" items="center"
        >
          <span text="sm">{{ $t('common.play_all') }}</span>
        </ALink>
        <ALink
          :href="viewAllUrl"
          type="topBar"
          flex="~" items="center"
        >
          <span text="sm">{{ $t('common.view_all') }}</span>
        </ALink>
      </div>
    </header>

    <!-- watchLater wrapper -->
    <main
      overflow-hidden rounded="$bew-radius"
      flex="~ col gap-2"
      p="x-4"
    >
      <!-- loading -->
      <Loading
        v-if="isLoading && watchLaterList.length === 0"
        h="full"
        flex="~ items-center"
      />

      <!-- empty -->
      <Empty
        v-if="!isLoading && watchLaterList.length === 0"
        pos="absolute top-0 left-0"
        bg="$bew-content"
        z="0" w="full" h="full"
        flex="~ items-center"
        rounded="$bew-radius"
      />

      <!-- watchlater -->
      <TransitionGroup name="list">
        <ALink
          v-for="(item, index) in watchLaterList"
          :key="item.aid"
          :href="getWatchLaterUrl(item.bvid)"
          class="group"
          type="topBar"
          m="last:b-4" p="2"
          rounded="$bew-radius"
          hover:bg="$bew-fill-2"
          duration-300
        >
          <section flex="~ gap-4 item-start">
            <!-- Video cover, live cover, ariticle cover -->
            <div
              bg="$bew-skeleton"
              pos="relative"
              w="150px"
              flex="shrink-0"
              border="rounded-$bew-radius-half"
              overflow="hidden"
            >
              <!-- Delete button -->
              <div
                class="group-hover:opacity-100 opacity-0"
                pos="absolute top-0 right-0" z-1 w-24px h-24px
                bg="black opacity-60 hover:$bew-error-color"
                grid="~ place-items-center"
                m="1"
                text="white xs"
                duration-300
                border="rounded-full"
                @click.stop.prevent="deleteWatchLaterItem(index, item.aid)"
              >
                <i i-mingcute:close-line />
              </div>

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
        </ALink>
      </TransitionGroup>

      <!-- loading -->
      <Transition name="fade">
        <Loading v-if="isLoading && watchLaterList.length !== 0" m="-t-4" />
      </Transition>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  --uno: "relative text-$bew-text-2";

  &::after {
    --uno: "absolute bottom-0 left-0 w-full h-12px bg-$bew-theme-color opacity-0 transform scale-x-0 -z-1";
    --uno: "transition-all duration-300";
    content: "";
  }
}

.tab-selected {
  --uno: "font-bold text-$bew-text-1";

  &::after {
    --uno: "scale-x-80 opacity-40";
  }
}
</style>
