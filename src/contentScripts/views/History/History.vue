<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useBewlyApp } from '~/composables/useAppProvider'
import { getCSRF } from '~/utils/main'

import HistoryVideoCard from './components/HistoryVideoCard.vue'
import { historyProvider } from './HistoryProvider'

withDefaults(defineProps<{
  parent?: 'tab-page' | 'dialog' // 区分是在标签页还是对话框中打开页面
}>(), {
  parent: 'tab-page',
})

const { t } = useI18n()
const { handlePageRefresh, handleReachBottom } = useBewlyApp()

const {
  isLoading,
  noMoreContent,
  historyList,
  currentPageNum,
  keyword,
  historyStatus,
  getHistoryList,
  searchHistoryList,
  deleteHistoryItem,
  setHistoryPauseStatus,
  clearAllHistory,
} = historyProvider()

onMounted(() => {
  getHistoryList()
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

function handleSearch() {
  historyList.length = 0
  currentPageNum.value = 1
  noMoreContent.value = false
  if (keyword.value)
    searchHistoryList()
  else getHistoryList()
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
      <h3 v-if="parent !== 'dialog'" text="3xl $bew-text-1" font-bold mb-6>
        {{ $t('history.title') }}
      </h3>
      <!-- historyList -->
      <TransitionGroup name="list">
        <template v-for="(historyItem, index) in historyList" :key="historyItem.kid">
          <HistoryVideoCard
            :index="index"
            :history-item="historyItem"
            @delete-item="deleteHistoryItem"
          />
        </template>
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
      <div
        :class="{ 'top-120px my-10': parent === 'tab-page' }"
        pos="sticky top-0"
        flex="~ col gap-4"
        justify-start
        m="t-1 b-10" w-full
      >
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
