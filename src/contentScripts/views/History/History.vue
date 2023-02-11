<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import type { HistoryItem } from './types'
import {
  calcCurrentTime,
  getCSRF,
  openLinkToNewTab,
  removeHttpFromUrl,
} from '~/utils'

const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()
const historyList = reactive<Array<HistoryItem>>([])
const currentPageNum = ref<number>(1)
const keyword = ref<string>()
const historyStatus = ref<boolean>()

watch(() => keyword.value, (newValue, oldValue) => {
  window.onscroll = () => {
    if (
      window.innerHeight + window.scrollY
      >= document.body.scrollHeight - 20
    ) {
      if (isLoading.value)
        return

      if (!noMoreContent.value) {
        if (keyword.value)
          searchHistoryList()
        else
          getHistoryList()
      }
    }
  }
})

onMounted(() => {
  getHistoryList()
  getHistoryPauseStatus()

  window.onscroll = () => {
    if (
      window.innerHeight + window.scrollY
      >= document.body.scrollHeight - 20
    ) {
      if (isLoading.value)
        return

      if (!noMoreContent.value) {
        if (keyword.value)
          searchHistoryList()
        else
          getHistoryList()
      }
    }
  }
})

onUnmounted(() => {
  // remove the global window.onscroll event
  window.onscroll = () => {}
})

/**
 * Get history list
 */
function getHistoryList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryList',
      type: 'all',
      viewAt:
        historyList.length > 0
          ? historyList[historyList.length - 1].view_at
          : 0,
    })
    .then((res) => {
      if (res.code === 0) {
        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistoryItem) => {
          historyList.push(item)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function searchHistoryList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'searchHistoryList',
      pn: currentPageNum.value++,
      keyword: keyword.value,
    })
    .then((res) => {
      if (res.code === 0) {
        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistoryItem) => {
          historyList.push(item)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function handleSearch() {
  historyList.length = 0
  currentPageNum.value = 1
  if (keyword.value)
    searchHistoryList()
  else
    getHistoryList()
}

function deleteHistoryItem(index: number, historyItem: HistoryItem) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'deleteHistoryItem',
      kid: `${historyItem.history.business}_${historyItem.history.oid}`,
      csrf: getCSRF(),
    })
    .then((res) => {
      console.log(res)

      if (res.code === 0)
        historyList.splice(index, 1)
    })
}

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem) {
  // Video
  // if (activatedTab.value === 0)
  //   return item.history.bvid
  // // Live
  // else if (activatedTab.value === 1)
  //   return `//live.bilibili.com/${item.history.oid}`
  // // Article
  // else if (activatedTab.value === 2)
  //   return `/read/cv${item.history.oid}`

  return item.history.bvid
}

function getHistoryPauseStatus() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryPauseStatus',
    })
    .then((res) => {
      if (res.code === 0)
        historyStatus.value = res.data
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

function handlePauseWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm('Pause watch history?\nAre you sure you want to pause watch history?')
  if (result)
    setHistoryPauseStatus(true)
}

function handleTurnOnWatchHistory() {
  // eslint-disable-next-line no-alert
  const result = confirm('t=Turn on watch history?\nAre you sure you want to turn on watch history?')
  if (result)
    setHistoryPauseStatus(false)
}
</script>

<template>
  <div flex gap-4>
    <main w="80%" mb-6>
      <h3 text="3xl $bew-text-1" font-bold mb-6>
        Watch History
      </h3>
      <!-- historyList -->
      <transition-group name="list">
        <a
          v-for="(historyItem, index) in historyList"
          :key="historyItem.kid"
          block
          class="group"
          flex
          cursor-pointer
          @click="openLinkToNewTab(`${getHistoryUrl(historyItem)}`)"
        >
          <div
            mr-4
            px-4
            b-l="~ 2px dashed $bew-fill-2"
            group-hover:b-l="$bew-theme-color-40"
            flex
            items-center
            justify-center
            shrink-0
            relative
            duration-300
          >
            <!-- Dot -->
            <i
              pos="absolute left--1px"
              w-2
              h-2
              rounded-6
              bg="$bew-fill-3"
              group-hover:bg="$bew-theme-color"
              transform="~ translate-x--1/2"
              duration-300
            />
            <div
              text="sm $bew-text-3"
              group-hover:text="$bew-theme-color"
              bg="$bew-fill-1"
              group-hover:bg="$bew-theme-color-20"
              p="x-3 y-1"
              rounded-8
              duration-300
            >
              {{
                useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                  .value
              }}
            </div>
          </div>
          <section
            rounded="$bew-radius"
            flex="~ gap-4"
            item-start
            relative
            group-hover:bg="$bew-fill-2"
            duration-300
            w-full
            p="2"
          >
            <!-- Cover -->
            <div
              pos="relative"
              bg="$bew-fill-5"
              w="200px"
              flex="shrink-0"
              rounded="$bew-radius"
              overflow-hidden
            >
              <img
                w="300px"
                class="aspect-video"
                :src="`${removeHttpFromUrl(historyItem.cover)}@672w_378h_1c`"
                :alt="historyItem.title"
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
                <!--  When progress = -1 means that the user watched the full video -->
                {{
                  `${
                    historyItem.progress === -1
                      ? calcCurrentTime(historyItem.duration)
                      : calcCurrentTime(historyItem.progress)
                  } /
                      ${calcCurrentTime(historyItem.duration)}`
                }}
              </div>
              <div w-full pos="absolute bottom-0" bg="white opacity-60">
                <Progress
                  :percentage="
                    (historyItem.progress / historyItem.duration) * 100
                  "
                />
              </div>
            </div>

            <!-- Description -->
            <div flex justify-between w-full>
              <div>
                <h3
                  class="keep-two-lines"
                  overflow="hidden"
                  text="lg overflow-ellipsis"
                >
                  {{ historyItem.title }}
                </h3>
                <div text="$bew-text-2 sm" m="t-4" flex="~" items-center>
                  <img
                    :src="historyItem.author_face"
                    w-8
                    aspect-square
                    alt=""
                    rounded="$bew-radius-half"
                    mr-2
                  >
                  {{ historyItem.author_name }}
                  <!-- <span
                    v-if="historyItem.live_status === 1"
                    text="$bew-theme-color"
                    m="l-2"
                  ><tabler:live-photo />
                    Live
                  </span> -->
                </div>
              </div>

              <button
                text="2xl $bew-text-3"
                hover:color="$bew-error-color"
                opacity="0 group-hover:100"
                p-4
                duration-300
                @click.stop="deleteHistoryItem(index, historyItem)"
              >
                <tabler:trash />
              </button>
            </div>
          </section>
        </a>
      </transition-group>
      <!-- loading -->
      <loading v-if="isLoading && historyList.length !== 0 && !noMoreContent" m="-t-4" />
    </main>

    <aside relative w="20%">
      <div pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full>
        <input
          v-model.lazy.trim="keyword"
          type="text"
          placeholder="Search watch history"
          p="x-14px y-10px"
          rounded="$bew-radius"
          bg="$bew-content-solid-1"
          shadow="$bew-shadow-1"
          outline-none
          w-full
          @keyup.enter="handleSearch"
        >
        <Button shadow="$bew-shadow-1">
          <template #left>
            <tabler:trash />
          </template>
          Clear all watch history
        </Button>
        <Button v-if="!historyStatus" shadow="$bew-shadow-1" @click="handlePauseWatchHistory">
          <template #left>
            <ph:pause-circle-bold />
          </template>
          Pause watch history
        </Button>
        <Button v-else shadow="$bew-shadow-1" @click="handleTurnOnWatchHistory">
          <template #left>
            <ph:play-circle-bold />
          </template>
          Turn on watch history
        </Button>
      </div>
    </aside>
  </div>
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
