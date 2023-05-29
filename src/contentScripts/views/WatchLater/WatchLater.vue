<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import type { WatchLaterModel } from './types'
import { getCSRF, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'
import { calcCurrentTime } from '~/utils/dataFormatter'

const { t } = useI18n()

const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()
const watchLaterList = reactive<Array<WatchLaterModel>>([])
const currentPageNum = ref<number>(1)
const keyword = ref<string>()
const historyStatus = ref<boolean>()

onMounted(() => {
  getAllWatchLaterList()
})

onUnmounted(() => {
  // remove the global window.onscroll event
  window.onscroll = () => {}
})

/**
 * Get history list
 */
function getAllWatchLaterList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getAllWatchLaterList',
    })
    .then((res) => {
      if (res.code === 0)
        Object.assign(watchLaterList, res.data.list)

      isLoading.value = false
    })
}

function deleteWatchLaterItem(index: number, aid: number) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'removeFromWatchLater',
      aid,
      csrf: getCSRF(),
    })
    .then((res) => {
      if (res.code === 0)
        watchLaterList.splice(index, 1)
    })
}

function setHistoryPauseStatus(isPause: boolean) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'setHistoryPauseStatus',
      csrf: getCSRF(),
      switch: isPause,
    })
    .then((res) => {
      if (res.code === 0)
        getHistoryPauseStatus()
    })
}

function clearAllHistory() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'clearAllHistory',
      csrf: getCSRF(),
    })
    .then((res) => {
      if (res.code === 0)
        watchLaterList.length = 0
    })
}

function handleClearAllWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.clear_all_watch_history_confirm'),
  )
  if (result)
    clearAllHistory()
}

function handlePauseWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.pause_watch_history_confirm'),
  )
  if (result)
    setHistoryPauseStatus(true)
}

function handleTurnOnWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm(
    t('history.turn_on_watch_history_confirm'),
  )
  if (result)
    setHistoryPauseStatus(false)
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div v-if="getCSRF()" flex="~ col md:row lg:row" gap-4>
    <main w="full md:60% lg:70% xl:75%" order="2 md:1 lg:1" mb-6>
      <h3 text="3xl $bew-text-1" font-bold mb-6>
        Watch later ({{ watchLaterList.length }}/100)
      </h3>
      <!-- historyList -->
      <transition-group name="list">
        <a
          v-for="(item, index) in watchLaterList"
          :key="item.aid"
          block
          class="group"
          flex
          cursor-pointer
          @click="openLinkToNewTab(removeHttpFromUrl(`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`))"
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

              <div
                pos="absolute bottom-0 right-0"
                bg="black opacity-60"
                m="2"
                p="x-2 y-1"
                text="white xs"
                rounded-8
              >
                {{ calcCurrentTime(item.duration) }}
              </div>
            </div>

            <!-- Description -->
            <div flex justify-between w-full>
              <div flex="~ col">
                <a
                  class="keep-two-lines"
                  overflow="hidden"
                  un-text="lg overflow-ellipsis"
                  :href="removeHttpFromUrl(`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`)" target="_blank"
                  @click.stop=""
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
                  rounded="$bew-radius-half"
                  hover:color="$bew-theme-color"
                  hover:bg="$bew-theme-color-10"
                  duration-300
                  pr-2
                  :href="`//space.bilibili.com/${item.owner.mid}`" target="_blank"
                  @click.stop=""
                >
                  <img
                    :src="removeHttpFromUrl(`${item.owner.face}@80w_80h_1c`)"
                    w-30px
                    aspect-square
                    object-cover
                    alt=""
                    rounded="$bew-radius-half"
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

              <button
                text="2xl $bew-text-3"
                hover:color="$bew-theme-color"
                opacity="0 group-hover:100"
                p-2
                duration-300
                @click.stop="deleteWatchLaterItem(index, item.aid)"
              >
                <tabler:trash />
              </button>
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
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div
        pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full h="[calc(100vh-160px)]" p-6
        rounded="$bew-radius" overflow-hidden
      >
        <img
          v-if="watchLaterList[0]" :src="removeHttpFromUrl(`${watchLaterList[0].pic}@480w_270h_1c`)"
          rounded="$bew-radius"
        >

        <h3 text="3xl" fw-600>
          Watch later ({{ watchLaterList.length }}/100)
        </h3>
        <p flex gap-4>
          <Button flex-1>
            Play all
          </Button>
          <Button flex-1>
            Shuffle
          </Button>
        </p>
        <div
          v-if="watchLaterList[0]"
          pos="absolute top-0 left-0" w-full h-full bg-cover bg-center z--1 opacity-60
        >
          <div absolute w-full h-full style="backdrop-filter: blur(60px) saturate(180%)" />
          <img
            v-if="watchLaterList[0]"
            :src="removeHttpFromUrl(`${watchLaterList[0].pic}@480w_270h_1c`)"
            w-full h-full object="cover center"
          >
        </div>
        <!-- <Button shadow="$bew-shadow-1" @click="handleClearAllWatchHistory">
          <template #left>
            <tabler:trash />
          </template>
          {{ $t('history.clear_all_watch_history') }}
        </Button>
        <Button
          v-if="!historyStatus"
          shadow="$bew-shadow-1"
          @click="handlePauseWatchHistory"
        >
          <template #left>
            <ph:pause-circle-bold />
          </template>
          {{ $t('history.pause_watch_history') }}
        </Button>
        <Button v-else shadow="$bew-shadow-1" @click="handleTurnOnWatchHistory">
          <template #left>
            <ph:play-circle-bold />
          </template>
          {{ $t('history.turn_on_watch_history') }}
        </Button> -->
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
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  --at-apply: opacity-0 transform translate-y-2 transform-gpu;
}
</style>
