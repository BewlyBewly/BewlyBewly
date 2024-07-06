<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import Button from '~/components/Button.vue'
import Empty from '~/components/Empty.vue'
import Progress from '~/components/Progress.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { HistoryResult, List as HistoryItem } from '~/models/history/history'
import { Business } from '~/models/history/history'
import type { HistorySearchResult, List as HistorySearchItem } from '~/models/video/historySearch'
import { calcCurrentTime } from '~/utils/dataFormatter'
import { getCSRF, removeHttpFromUrl } from '~/utils/main'

const { t } = useI18n()
const api = useApiClient()
const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>(false)
const historyList = reactive<Array<HistoryItem>>([])
const currentPageNum = ref<number>(1)
const keyword = ref<string>()
const historyStatus = ref<boolean>()
const { handlePageRefresh, handleReachBottom, haveScrollbar } = useBewlyApp()

const HistoryBusiness = computed(() => {
  return Business
})

onMounted(() => {
  getHistoryList()
  getHistoryPauseStatus()

  initPageAction()
})

function initPageAction() {
  handleReachBottom.value = () => {
    if (isLoading.value)
      return
    if (noMoreContent.value)
      return

    if (keyword.value)
      searchHistoryList()
    else
      getHistoryList()
  }

  handlePageRefresh.value = () => {
    historyList.length = 0
    currentPageNum.value = 1
    noMoreContent.value = false
    getHistoryList()
  }
}

/**
 * Get history list
 */
function getHistoryList() {
  isLoading.value = true
  api.history.getHistoryList({
    type: 'all',
    view_at:
        historyList.length > 0
          ? historyList[historyList.length - 1].view_at
          : 0,
  })
    .then((res: HistoryResult) => {
      if (res.code === 0) {
        if (Array.isArray(res.data.list) && res.data.list.length > 0)
          historyList.push(...res.data.list)

        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        noMoreContent.value = false

        if (!haveScrollbar() && !noMoreContent.value) {
          getHistoryList()
        }
      }
      isLoading.value = false
    })
}

function searchHistoryList() {
  isLoading.value = true
  api.history.searchHistoryList({
    pn: currentPageNum.value++,
    keyword: keyword.value,
  })
    .then((res: HistorySearchResult) => {
      if (res.code === 0) {
        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistorySearchItem) => {
          historyList.push(item as unknown as HistoryItem)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function handleSearch() {
  historyList.length = 0
  currentPageNum.value = 1
  noMoreContent.value = false
  if (keyword.value)
    searchHistoryList()
  else getHistoryList()
}

function deleteHistoryItem(index: number, historyItem: HistoryItem) {
  api.history.deleteHistoryItem({
    kid: `${historyItem.history.business}_${historyItem.history.oid}`,
    csrf: getCSRF(),
  })
    .then((res) => {
      if (res.code === 0)
        historyList.splice(index, 1)
    })
}

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem): string {
  if (item.uri)
    return item.uri

  // Video
  if (item.history.business === Business.ARCHIVE) {
    if (item?.videos && item.videos > 0)
      return `//www.bilibili.com/video/${item.history.bvid}?p=${item.history.page}`
    return `//www.bilibili.com/video/${item.history.bvid}`
  }
  // Live
  else if (item.history.business === Business.LIVE) {
    return `//live.bilibili.com/${item.history.oid}`
  }
  // Article
  else if (item.history.business === Business.ARTICLE || item.history.business === Business.ARTICLE_LIST) {
    if (item.history.cid === 0)
      return `//www.bilibili.com/read/cv${item.history.oid}`
    else
      return `//www.bilibili.com/read/cv${item.history.cid}`
  }
  return ''
}

function getHistoryItemCover(item: HistoryItem) {
  if (item.history.business === 'article' || item.history.business === 'article-list') {
    if (item.covers)
      return removeHttpFromUrl(`${item.covers[0]}`)
  }

  return removeHttpFromUrl(item.cover)
}

function getHistoryPauseStatus() {
  api.history.getHistoryPauseStatus()
    .then((res) => {
      if (res.code === 0)
        historyStatus.value = res.data
    })
}

function setHistoryPauseStatus(isPause: boolean) {
  api.history.setHistoryPauseStatus({
    csrf: getCSRF(),
    switch: isPause,
  })
    .then((res) => {
      if (res.code === 0)
        getHistoryPauseStatus()
    })
}

function clearAllHistory() {
  api.history.clearAllHistory({
    csrf: getCSRF(),
  })
    .then((res) => {
      if (res.code === 0)
        historyList.length = 0
    })
}

function handleClearAllWatchHistory() {
  const result = confirm(
    t('history.clear_all_watch_history_confirm'),
  )
  if (result)
    clearAllHistory()
}

function handlePauseWatchHistory() {
  const result = confirm(
    t('history.pause_watch_history_confirm'),
  )
  if (result)
    setHistoryPauseStatus(true)
}

function handleTurnOnWatchHistory() {
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
        {{ $t('history.title') }}
      </h3>
      <!-- historyList -->
      <TransitionGroup name="list">
        <a
          v-for="(historyItem, index) in historyList"
          :key="historyItem.kid" :href="getHistoryUrl(historyItem)"
          target="_blank"
          block
          class="group"
          flex
          cursor-pointer
        >
          <!-- time slot -->
          <div
            mr-8 px-4
            b-l="~ 2px dashed $bew-fill-2"
            group-hover:b-l="$bew-theme-color-40"
            shrink-0
            relative
            duration-300
            flex="important-xl:~ items-center justify-center"
            hidden
          >
            <!-- hidden lg:flex -->
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
            flex="~ gap-6 col md:col lg:row items-start"
            relative
            group-hover:bg="$bew-fill-2"
            duration-300 w-full
            p-2 m-1
            content-visibility-auto
          >
            <!-- Cover -->
            <div
              pos="relative"
              bg="$bew-skeleton"
              w="full md:full lg:250px"
              flex="shrink-0"
              rounded="$bew-radius"
              overflow-hidden
              aspect-video
            >
              <img
                w="full"
                aspect-video
                :src="`${getHistoryItemCover(historyItem)}@480w_270h_1c`"
                :alt="historyItem.title"
                object-cover
              >

              <span
                v-if="historyItem.history.business !== HistoryBusiness.ARCHIVE"
                pos="absolute right-0 top-0"
                bg="$bew-theme-color"
                text="xs white"
                p="x-2 y-1"
                m-1
                rounded="$bew-radius-half"
              >
                <template
                  v-if="historyItem.history.business === HistoryBusiness.LIVE"
                >
                  Livestreaming
                </template>
                <template
                  v-else-if="historyItem.history.business === HistoryBusiness.PGC"
                >
                  PGC
                </template>
              </span>

              <div
                v-if="
                  historyItem.history.business === HistoryBusiness.ARCHIVE
                    || historyItem.history.business === HistoryBusiness.PGC
                "
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
                  v-if="
                    historyItem.history.business === HistoryBusiness.ARCHIVE
                      || historyItem.history.business === HistoryBusiness.PGC
                  "
                  :percentage="
                    (historyItem.progress / historyItem.duration) * 100
                  "
                />
              </div>
            </div>

            <!-- Description -->
            <div flex justify-between w-full h-full>
              <div flex="~ col">
                <a
                  :href="`${getHistoryUrl(historyItem)}`" target="_blank" rel="noopener noreferrer"
                  :title="historyItem.show_title ? historyItem.show_title : historyItem.title"
                >
                  <h3
                    class="keep-two-lines"
                    overflow="hidden"
                    text="lg overflow-ellipsis"
                  >
                    {{ historyItem.show_title ? historyItem.show_title : historyItem.title }}
                  </h3>
                </a>
                <a
                  un-text="$bew-text-2 sm"
                  m="t-4 b-2"
                  flex="~ items-center"
                  cursor-pointer
                  w-fit
                  rounded="$bew-radius"
                  hover:color="$bew-theme-color"
                  hover:bg="$bew-theme-color-10"
                  duration-300
                  pr-2
                  :href="historyItem.author_mid ? `https://space.bilibili.com/${historyItem.author_mid}` : historyItem.uri" target="_blank" rel="noopener noreferrer"
                >
                  <img
                    :src="
                      removeHttpFromUrl(`${historyItem.author_face
                        ? historyItem.author_face
                        : historyItem.cover}@40w_40h_1c`)
                    "
                    w-30px
                    aspect-square
                    object-cover
                    alt=""
                    rounded="1/2"
                    mr-2
                  >
                  {{
                    historyItem.author_name
                      ? historyItem.author_name
                      : historyItem.title
                  }}
                  <span
                    v-if="historyItem.live_status === 1"
                    text="$bew-theme-color"
                    flex
                    items-center
                    gap-1
                    m="l-2"
                  ><div i-tabler:live-photo />
                    Live
                  </span>
                </a>
                <div
                  display="xl:none"
                  flex items-center
                  text="$bew-text-3 sm"
                  mt-auto
                >
                  <span text-xl mr-2 lh-0>
                    <i
                      v-if="historyItem.history.dt === 1 || historyItem.history.dt === 3 || historyItem.history.dt === 5 || historyItem.history.dt === 7"
                      i-mingcute:cellphone-line
                    />
                    <i v-if="historyItem.history.dt === 2" i-mingcute:tv-1-line />
                    <i
                      v-if="historyItem.history.dt === 4 || historyItem.history.dt === 6" i-mingcute:pad-line
                    />
                    <i v-if="historyItem.history.dt === 33" i-mingcute:tv-2-line />
                  </span>
                  <span>
                    {{
                      useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                        .value
                    }}
                  </span>
                </div>
              </div>

              <button
                text="2xl $bew-text-3"
                hover:color="$bew-theme-color"
                opacity-0 group-hover:opacity-100
                p-2
                duration-300
                @click.prevent="deleteHistoryItem(index, historyItem)"
              >
                <div i-tabler:trash />
              </button>
            </div>
          </section>
        </a>
      </TransitionGroup>

      <!-- no more content -->
      <Empty v-if="noMoreContent" class="py-4" :description="$t('common.no_more_content')" />

      <!-- loading -->
      <Transition name="fade">
        <loading
          v-if="isLoading && historyList.length !== 0 && !noMoreContent"
          m="-t-4"
        />
      </Transition>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full>
        <input
          v-model.lazy.trim="keyword"
          type="text"
          :placeholder="t('history.search_watch_history')"
          p="x-14px"
          lh-35px h-35px
          rounded="$bew-radius"
          bg="$bew-content-solid"
          shadow="$bew-shadow-1"
          outline-none
          w-full
          @keyup.enter="handleSearch"
        >
        <Button
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handleClearAllWatchHistory"
        >
          <template #left>
            <div i-tabler:trash />
          </template>
          {{ $t('history.clear_all_watch_history') }}
        </Button>
        <Button
          v-if="!historyStatus"
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handlePauseWatchHistory"
        >
          <template #left>
            <div i-ph:pause-circle-bold />
          </template>
          {{ $t('history.pause_watch_history') }}
        </Button>
        <Button
          v-else
          block
          style="
            --b-button-shadow: var(--bew-shadow-1);
          "
          @click="handleTurnOnWatchHistory"
        >
          <template #left>
            <div i-ph:play-circle-bold />
          </template>
          {{ $t('history.turn_on_watch_history') }}
        </Button>
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
