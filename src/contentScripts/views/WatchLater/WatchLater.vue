<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { getCSRF, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'
import { calcCurrentTime } from '~/utils/dataFormatter'
import type { List as VideoItem, WatchLaterResult } from '~/models/video/watchLater'

const { t } = useI18n()
const api = useApiClient()
const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()
const watchLaterList = reactive<VideoItem[]>([])
const { handlePageRefresh } = useBewlyApp()

onMounted(() => {
  getAllWatchLaterList()
  initPageAction()
})

function initPageAction() {
  handlePageRefresh.value = () => {
    if (isLoading.value)
      return

    watchLaterList.length = 0
    getAllWatchLaterList()
  }
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
      if (res.code === 0)
        watchLaterList.splice(index, 1)
    })
}

function handleClearAllWatchLater() {
  const result = confirm(
    t('watch_later.clear_all_confirm'),
  )
  if (result) {
    isLoading.value = true
    api.watchlater.clearAllWatchLater({
      csrf: getCSRF(),
    }).then((res) => {
      if (res.code === 0)
        getAllWatchLaterList()
    }).finally(() => {
      isLoading.value = false
    })
  }
}

function handleRemoveWatchedVideos() {
  const result = confirm(
    t('watch_later.remove_watched_videos_confirm'),
  )
  if (result) {
    api.watchlater.removeFromWatchLater({
      viewed: true,
      csrf: getCSRF(),
    })
      .then((res) => {
        if (res.code === 0)
          getAllWatchLaterList()
      })
  }
}

function handlePlayAll() {
  openLinkToNewTab('https://www.bilibili.com/list/watchlater')
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div v-if="getCSRF()" flex="~ col md:row lg:row" gap-4>
    <main w="full md:60% lg:70% xl:75%" order="2 md:1 lg:1" mb-6>
      <h3 text="3xl $bew-text-1" font-bold mb-6>
        {{ t('watch_later.title') }} ({{ watchLaterList.length }})
      </h3>
      <Empty v-if="watchLaterList.length === 0 && !isLoading" />
      <template v-else>
        <!-- watcher later list -->
        <transition-group name="list">
          <a
            v-for="(item, index) in watchLaterList"
            :key="item.aid"
            :href="`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`" target="_blank" rel="noopener noreferrer"
            class="group"
            block flex cursor-pointer
          >
            <section
              rounded="$bew-radius"
              flex="~ gap-6 col md:col lg:row"
              item-start
              relative
              group-hover:bg="$bew-fill-2"
              duration-300
              w-full
              p-2
              m-1
            >
              <!-- Cover -->
              <div
                pos="relative"
                bg="$bew-fill-5"
                w="full md:full lg:250px"
                flex="shrink-0"
                rounded="$bew-radius"
                overflow-hidden
                aspect-video
              >
                <img
                  w="full"
                  aspect-video
                  :src="removeHttpFromUrl(`${item.pic}@480w_270h_1c`)"
                  :alt="item.title"
                  object-cover
                >

                <!-- <div
                  pos="absolute bottom-0 right-0"
                  bg="black opacity-60"
                  m="2"
                  p="x-2 y-1"
                  text="white xs"
                  rounded-8
                >
                  {{ calcCurrentTime(item.duration) }}
                </div> -->
                <div

                  pos="absolute bottom-0 right-0"
                  bg="black opacity-60"
                  m="2"
                  p="x-2 y-1"
                  text="white xs"
                  rounded-8
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
                <div w-full pos="absolute bottom-0" bg="white opacity-60">
                  <Progress
                    :percentage="
                      (item.progress / item.duration) * 100
                    "
                  />
                </div>
              </div>

              <!-- Description -->
              <div flex justify-between w-full>
                <div flex="~ col">
                  <a
                    class="keep-two-lines"
                    overflow="hidden"
                    un-text="lg overflow-ellipsis"
                    :href="removeHttpFromUrl(`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`)" target="_blank" rel="noopener noreferrer"
                  >
                    {{ item.title }}
                  </a>
                  <a
                    un-text="$bew-text-2 sm"
                    m="t-4 b-2"
                    flex="~"
                    items-center
                    cursor-pointer
                    w-fit
                    rounded="$bew-radius"
                    hover:color="$bew-theme-color"
                    hover:bg="$bew-theme-color-10"
                    duration-300
                    pr-2
                    :href="`//space.bilibili.com/${item.owner.mid}`" target="_blank" rel="noopener noreferrer"
                  >
                    <img
                      :src="removeHttpFromUrl(`${item.owner.face}@40w_40h_1c`)"
                      w-30px
                      aspect-square
                      object-cover
                      alt=""
                      rounded="1/2"
                      mr-2
                    >
                    {{ item.owner.name }}
                  </a>
                  <p display="block xl:none" text="$bew-text-3 sm" mt-auto mb-2>
                    {{
                      useDateFormat(item.pubdate * 1000, 'YYYY-MM-DD HH:mm:ss')
                        .value
                    }}
                  </p>
                </div>

                <div flex items-center>
                  <!-- <span>{{ item.progress === -1 ? $t('watch_later.watched') : '' }}</span> -->

                  <button
                    text="2xl $bew-text-3"
                    hover:color="$bew-theme-color"
                    opacity-0 group-hover:opacity-100
                    p-2
                    duration-300
                    @click.prevent="deleteWatchLaterItem(index, item.aid)"
                  >
                    <tabler:trash />
                  </button>
                </div>

              </div>
            </section>
          </a>
        </transition-group>
        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="isLoading && watchLaterList.length !== 0 && !noMoreContent"
            m="-t-4"
          />
        </Transition>
      </template>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div
        pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full
        h="auto md:[calc(100vh-160px)]" p-6
        rounded="$bew-radius" overflow-hidden bg="$bew-fill-3"
      >
        <div
          pos="absolute top-0 left-0" w-full h-full bg-cover bg-center
          z--1
        >
          <div
            absolute w-full h-full backdrop-blur-40px
            bg="$bew-fill-4"
          />
          <img
            v-if="watchLaterList[0]"
            :src="removeHttpFromUrl(`${watchLaterList[0].pic}@480w_270h_1c`)"
            w-full h-full object="cover center"
          >
        </div>

        <picture
          rounded="$bew-radius" style="box-shadow: 0 16px 24px -12px rgba(0, 0, 0, .36)"
          aspect-video mb-4 bg="$bew-fill-2"
        >
          <img
            v-if="watchLaterList[0]" :src="removeHttpFromUrl(`${watchLaterList[0].pic}@480w_270h_1c`)"
            rounded="$bew-radius" aspect-video w-full
          >
        </picture>

        <h3 text="3xl white" fw-600 style="text-shadow: 0 0 12px rgba(0,0,0,.3)">
          {{ t('watch_later.title') }} ({{ watchLaterList.length }})
        </h3>
        <p v-if="watchLaterList.length > 0" flex="~ col" gap-4>
          <Button
            color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
            @click="handlePlayAll"
          >
            <template #left>
              <tabler:player-play />
            </template>
            {{ t('common.play_all') }}
          </Button>
          <Button
            color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
            @click="handleClearAllWatchLater"
          >
            <template #left>
              <tabler:trash />
            </template>
            {{ t('watch_later.clear_all') }}
          </Button>
          <Button
            color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
            @click="handleRemoveWatchedVideos"
          >
            <template #left>
              <tabler:circle-minus />
            </template>
            {{ t('watch_later.remove_watched_videos') }}
          </Button>
        </p>
      </div>
    </aside>
  </div>
  <Empty v-else mt-6 :description="t('common.please_log_in_first')">
    <Button type="primary" @click="jumpToLoginPage()">
      {{ $t('common.login') }}
    </Button>
  </Empty>
</template>

<style lang="scss" scoped>
</style>
