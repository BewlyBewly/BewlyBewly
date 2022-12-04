<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { useDateFormat } from '@vueuse/core'
import type { HistoryItem } from './types'
import { HistoryType } from './types'
import { calcCurrentTime } from '~/utils'
const { t } = useI18n()

const historys = reactive<Array<HistoryItem>>([])
const historyTabs = reactive([
  {
    id: 0,
    name: t('topbar.moments_dropdown.tabs.videos'),
    isSelected: true,
  },
  {
    id: 1,
    name: t('topbar.moments_dropdown.tabs.live'),
    isSelected: false,
  },
  {
    id: 2,
    name: t('topbar.moments_dropdown.tabs.articles'),
    isSelected: false,
  },
])
/**
 * Active tab (0: archive, 1: live, 2: article)
 */
const activatedTab = ref<number>(0)
const isLoading = ref<boolean>(false)
// when noMoreContent is true, the user can't scroll down to load more content
const noMoreContent = ref<boolean>(false)
const livePage = ref<number>(1)
const historysWrap = ref<HTMLElement>() as Ref<HTMLElement>

watch(activatedTab, (newVal: number, oldVal: number) => {
  if (newVal === oldVal)
    return

  historys.length = 0
  if (historysWrap.value)
    scrollToTop(historysWrap.value, 300)

  if (newVal === 0) {
    getHistoryList(HistoryType.Archive)
  }
  else if (newVal === 1) {
    livePage.value = 1
    getHistoryList(HistoryType.Live)
  }
  else if (newVal === 2) {
    getHistoryList(HistoryType.Article)
  }
})

onMounted(() => {
  getHistoryList(HistoryType.Archive)

  if (historysWrap.value) {
    historysWrap.value.addEventListener('scroll', () => {
      // When you scroll to the bottom, they will automatically
      // add the next page of data to the history list
      if (
        historysWrap.value.clientHeight + historysWrap.value.scrollTop
          >= historysWrap.value.scrollHeight - 20
        && historys.length > 0
        && !isLoading.value
      ) {
        if (activatedTab.value === 0 && !noMoreContent.value) {
          getHistoryList(
            HistoryType.Archive,
            historys[historys.length - 1].view_at,
          )
        }
        else if (activatedTab.value === 1 && !noMoreContent.value) {
          getHistoryList(
            HistoryType.Live,
            historys[historys.length - 1].view_at,
          )
        }
        else if (activatedTab.value === 2 && !noMoreContent.value) {
          getHistoryList(
            HistoryType.Article,
            historys[historys.length - 1].view_at,
          )
        }
      }
    })
  }
})

function onClickTab(tabId: number) {
  // Prevent changing tab when loading, cuz it will cause a bug
  if (isLoading.value)
    return

  activatedTab.value = tabId
  historyTabs.forEach((tab) => {
    tab.isSelected = tab.id === tabId
  })
}

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem) {
  // Video
  if (activatedTab.value === 0)
    return item.history.bvid
  // Live
  else if (activatedTab.value === 1)
    return `//live.bilibili.com/${item.history.oid}`
  // Article
  else if (activatedTab.value === 2)
    return `/read/cv${item.history.oid}`

  return ''
}

/**
 * Get history list
 * @param {HistoryType} type
 * @param {number} viewAt Last viewed timestamp
 */
function getHistoryList(type: HistoryType, viewAt = 0 as number) {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryList',
      type,
      viewAt,
    })
    .then((res) => {
      if (res.code === 0) {
        if (historys.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistoryItem) => {
          historys.push(item)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

/**
 * smooth scroll to the top of the html element
 */
function scrollToTop(element: HTMLElement, duration: number) {
  // cancel if already on top
  if (element.scrollTop === 0)
    return

  const cosParameter = element.scrollTop / 2
  let scrollCount = 0
  let oldTimestamp = 0

  function step(newTimestamp: number) {
    if (oldTimestamp !== 0) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration
      if (scrollCount >= Math.PI)
        return (element.scrollTop = 0)
      element.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount)
    }
    oldTimestamp = newTimestamp
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}
</script>

<template>
  <div
    bg="$bew-content-solid-1"
    w="380px"
    rounded="$bew-radius"
    pos="relative"
    style="box-shadow: var(--bew-shadow-2)"
  >
    <!-- top bar -->
    <div
      flex="~"
      justify="between"
      p="y-4 x-6"
      pos="fixed top-0 left-0"
      w="full"
      bg="$bew-content-1"
      z="2"
      border="!rounded-t-$bew-radius"
      style="backdrop-filter: var(--bew-filter-glass)"
    >
      <div flex="~">
        <div
          v-for="tab in historyTabs"
          :key="tab.id"
          m="r-4"
          transition="all duration-300"
          class="tab"
          :class="tab.isSelected ? 'tab-selected' : ''"
          cursor="pointer"
          @click="onClickTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
      <a href="https://t.bilibili.com/" target="_blank" flex="~" items="center">
        <span text="sm">{{ $t('common.view_all') }}</span>
      </a>
    </div>

    <!-- historys wrapper -->
    <div
      ref="historysWrap"
      flex="~ col gap-4"
      h="430px"
      overflow="y-scroll"
      p="x-4"
    >
      <!-- loading -->
      <Loading
        v-if="isLoading && historys.length === 0"
        pos="absolute left-0"
        bg="$bew-content-1"
        z="1"
        w="full"
        h="full"
        flex="~"
        items="center"
        border="rounded-$bew-radius"
      />

      <!-- empty -->
      <Empty v-if="!isLoading && historys.length === 0" w="full" h="full" />

      <!-- historys -->
      <transition-group name="list">
        <a
          v-for="historyItem in historys"
          :key="historyItem.kid"
          :href="getHistoryUrl(historyItem)"
          target="_blank"
          hover:bg="$bew-fill-2"
          border="rounded-$bew-radius"
          p="2"
          m="first:t-50px last:b-4"
          class="group"
          transition="duration"
        >
          <section flex="~ gap-4" align="item-start">
            <!-- Video cover, live cover, ariticle cover -->
            <div
              bg="$bew-fill-1"
              w="150px"
              flex="shrink-0"
              border="rounded-$bew-radius-half"
              overflow="hidden"
            >
              <!-- Video -->
              <template v-if="activatedTab === 0">
                <div pos="relative">
                  <img
                    w="150px"
                    class="aspect-video"
                    :src="`${historyItem.cover}@256w_144h_1c`"
                    :alt="historyItem.title"
                    bg="contain"
                  >
                  <div
                    pos="absolute bottom-0 right-0"
                    bg="black opacity-60"
                    m="1"
                    p="x-2 y-1"
                    text="white xs"
                    border="rounded-full"
                    opacity="0"
                    group-hover:opacity="100"
                  >
                    {{
                      `${calcCurrentTime(historyItem.progress)} /
                    ${calcCurrentTime(historyItem.duration)}`
                    }}
                  </div>
                </div>
                <Progress
                  :percentage="
                    (historyItem.progress / historyItem.duration) * 100
                  "
                />
              </template>

              <!-- Live -->
              <template v-else-if="activatedTab === 1">
                <div pos="relative">
                  <img
                    w="150px"
                    class="aspect-video"
                    :src="`${historyItem.cover}@256w_144h_1c`"
                    :alt="historyItem.title"
                    bg="contain"
                  >
                  <div
                    v-if="historyItem.live_status === 1"
                    pos="absolute top-0 left-0"
                    bg="rose-600"
                    text="xs white"
                    p="x-2 y-1"
                    m="1"
                    border="rounded-$bew-radius-half"
                    font="semibold"
                  >
                    LIVE
                  </div>
                  <div
                    v-else
                    pos="absolute top-0 left-0"
                    bg="gray-500 opacity-55"
                    text="xs white"
                    p="x-2 y-1"
                    m="1"
                    border="rounded-$bew-radius-half"
                  >
                    Offline
                  </div>
                </div>
              </template>

              <!-- Article -->
              <div v-else-if="activatedTab === 2">
                <img
                  w="150px"
                  class="aspect-video"
                  :src="`${
                    Array.isArray(historyItem.covers)
                      ? historyItem.covers[0]
                      : ''
                  }@256w_144h_1c`"
                  :alt="historyItem.title"
                  bg="contain"
                >
              </div>
            </div>

            <!-- Description -->
            <div>
              <h3
                style="
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  display: -webkit-box;
                "
                overflow="hidden"
                text="overflow-ellipsis"
              >
                {{ historyItem.title }}
              </h3>
              <div text="$bew-text-2 sm" m="t-4" flex="~" align="items-center">
                {{ historyItem.author_name }}
                <span
                  v-if="historyItem.live_status === 1"
                  text="$bew-theme-color"
                  m="l-2"
                ><tabler:live-photo />
                  Live
                </span>
              </div>
              <p text="$bew-text-2 sm">
                {{
                  useDateFormat(
                    historyItem.view_at * 1000,
                    'YYYY-MM-DD HH:mm:ss',
                  ).value
                }}
              </p>
            </div>
          </section>
        </a>
      </transition-group>

      <!-- loading -->
      <loading v-if="isLoading && historys.length !== 0" m="-t-4" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  @apply opacity-0 transform translate-y-2 transform-gpu;
}

.tab {
  @apply relative text-$bew-text-2;

  &::after {
    @apply absolute bottom-0 left-0 w-full h-12px bg-$bew-theme-color opacity-0 transform scale-x-0 -z-1 transition-all duration-300;
    content: '';
  }
}

.tab-selected {
  @apply font-bold text-$bew-text-1;

  &::after {
    @apply scale-x-80 opacity-40;
  }
}
</style>
