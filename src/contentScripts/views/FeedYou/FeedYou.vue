<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { useBewlyApp } from '~/composables/useAppProvider'
import { TOP_BAR_VISIBILITY_CHANGE } from '~/constants/globalEvents'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import { getCSRF } from '~/utils/main'
import emitter from '~/utils/mitt'

import FavoritesVideoCard from '../Favorites/components/FavoritesVideoCard.vue'
import { favoritesProvider } from '../Favorites/FavoritesProvider'
import HistoryVideoCard from '../History/components/HistoryVideoCard.vue'
import { historyProvider } from '../History/HistoryProvider'
import WatchLaterVideoCard from '../WatchLater/components/WatchLaterVideoCard.vue'
import { watchLaterProvider } from '../WatchLater/WatchLaterProvider'

const { t } = useI18n()
const { handlePageRefresh, handleReachBottom } = useBewlyApp()

// Watch Later
const {
  isLoading: isWatchLaterLoading,
  noMoreContent: noMoreWatchLaterContent,
  allWatchLaterList,
  currentWatchLaterList,
  watchLaterCount,
  pageNum,
  getAllWatchLaterList,
  getCurrentWatchLaterList,
  deleteWatchLaterItem,
} = watchLaterProvider()

// History
const {
  isLoading: isHistoryLoading,
  noMoreContent: noMoreHistoryContent,
  historyList,
  currentPageNum,
  keyword,
  getHistoryList,
  searchHistoryList,
  deleteHistoryItem,
} = historyProvider()

// Favorites
const {
  favoriteCategories,
  favoriteResources,
  selectedCategory,
  shouldMoveCtrlBarUp,
  currentPageNum: favoritesCurrentPageNum,
  isLoading: isFavoritesLoading,
  noMoreContent: noMoreFavoritesContent,
  getFavoriteCategories,
  getFavoriteResources,
  changeCategory,
  handleUnfavorite,
  handleSearch,
} = favoritesProvider()

// ==================== 页面切换逻辑 ====================
const activatedPage = ref<AppPage>(AppPage.History)
const pages: Partial<Record<AppPage, ReturnType<typeof defineAsyncComponent>>> = {
  [AppPage.WatchLater]: defineAsyncComponent(() => import('../WatchLater/WatchLater.vue')),
  [AppPage.History]: defineAsyncComponent(() => import('../History/History.vue')),
  [AppPage.Favorites]: defineAsyncComponent(() => import('../Favorites/Favorites.vue')),
}
const pagesTitle: Partial<Record<AppPage, ComputedRef<string>>> = {
  [AppPage.WatchLater]: computed(() => `${t('watch_later.title')} (${watchLaterCount.value ?? 0})`),
  [AppPage.History]: computed(() => t('history.title')),
  [AppPage.Favorites]: computed(() => t('favorites.title')),
}

const showViewDialog = ref<boolean>(false)

// 切换页面时更新激活页面状态
function handleClick(page: AppPage) {
  activatedPage.value = page
  showViewDialog.value = true
}

// 关闭弹窗
function closeDialog() {
  showViewDialog.value = false
}

// ==================== 页面生命周期事件 ====================
onMounted(async () => {
  initPageAction()
  await loadInitialData()

  // 加载历史记录数据
  getHistoryList()

  // 加载收藏夹分类并切换到第一个分类
  await getFavoriteCategories()
  changeCategory(favoriteCategories[0])

  setupTopBarListener()
})

onUnmounted(() => {
  teardownTopBarListener()
})

// 初始化页面刷新和滚动加载行为
function initPageAction() {
  handlePageRefresh.value = refreshAllData
  handleReachBottom.value = loadMoreData
}

// ==================== 数据加载逻辑 ====================

// 初始加载
async function loadInitialData() {
  resetWatchLaterData()
  await getAllWatchLaterList()
  loadCurrentWatchLaterPage()
}

// 刷新所有数据
function refreshAllData() {
  if (!isWatchLaterLoading.value) {
    resetWatchLaterData()
    getAllWatchLaterList()
  }

  // 重置历史记录数据
  resetHistoryData()
  getHistoryList()

  // 重置收藏夹数据
  if (!isFavoritesLoading.value) {
    resetFavoritesData()
    handleSearch()
  }
}

// 加载更多数据
async function loadMoreData() {
  if (!isWatchLaterLoading.value) {
    loadCurrentWatchLaterPage()
  }

  if (!isHistoryLoading.value && !noMoreHistoryContent.value) {
    if (keyword.value) {
      searchHistoryList()
    }
    else {
      getHistoryList()
    }
  }

  if (!isFavoritesLoading.value && !noMoreFavoritesContent.value) {
    await getFavoriteResources(selectedCategory.value!.id, ++favoritesCurrentPageNum.value, keyword.value)
  }
}

// ==================== 辅助函数 ====================

// 重置稍后观看数据
function resetWatchLaterData() {
  isWatchLaterLoading.value = false
  noMoreWatchLaterContent.value = false
  allWatchLaterList.value.length = 0
  currentWatchLaterList.value.length = 0
  pageNum.value = 1
}

// 加载当前稍后观看页面
function loadCurrentWatchLaterPage() {
  getCurrentWatchLaterList()
}

// 重置历史记录数据
function resetHistoryData() {
  historyList.length = 0
  currentPageNum.value = 1
  noMoreHistoryContent.value = false
}

// 重置收藏夹数据
function resetFavoritesData() {
  favoriteResources.length = 0
  favoritesCurrentPageNum.value = 1
  noMoreFavoritesContent.value = false
}

// 顶栏事件监听
function setupTopBarListener() {
  emitter.off(TOP_BAR_VISIBILITY_CHANGE)
  emitter.on(TOP_BAR_VISIBILITY_CHANGE, (isVisible) => {
    updateTopBarVisibility(isVisible)
  })
}

// 移除顶栏事件监听
function teardownTopBarListener() {
  emitter.off(TOP_BAR_VISIBILITY_CHANGE)
}

// 更新顶栏可见性状态
function updateTopBarVisibility(isVisible: boolean) {
  shouldMoveCtrlBarUp.value = false

  if (settings.value.autoHideTopBar && settings.value.showTopBar) {
    shouldMoveCtrlBarUp.value = !isVisible
  }
}
</script>

<template>
  <div v-if="getCSRF()" m="b-6">
    <!-- 稍后再看 -->
    <div flex justify-between items-center m="t-6 b-3">
      <h3 text="3xl $bew-text-1" font-bold>
        {{ t('watch_later.title') }} ({{ watchLaterCount }})
      </h3>
      <Button
        size="large"
        style="
              --b-button-shadow: var(--bew-shadow-1);
            "
        @click="handleClick(AppPage.WatchLater)"
      >
        {{ $t('common.view_all') }}
      </Button>
    </div>
    <!-- watcher later list -->
    <div flex="~ row gap-2" overflow-hidden>
      <TransitionGroup name="list">
        <template v-for="(item, index) in currentWatchLaterList" :key="item.aid">
          <WatchLaterVideoCard
            :index="index"
            :item="item"
            type="feed-you"
            shrink-0 basis="100% md:[calc(50%-5px)] lg:[calc(33.33%-5px)] xl:[calc(25%-5px)] 2xl:[calc(20%-5px)]"
            @delete-item="deleteWatchLaterItem"
          />
        </template>
      </TransitionGroup>
    </div>

    <!-- 观看历史 -->
    <div flex justify-between items-center m="t-6 b-3">
      <h3 text="3xl $bew-text-1" font-bold>
        {{ $t('history.title') }}
      </h3>
      <Button
        size="large"
        style="
              --b-button-shadow: var(--bew-shadow-1);
            "
        @click="handleClick(AppPage.History)"
      >
        {{ $t('common.view_all') }}
      </Button>
    </div>
    <!-- history list -->
    <div flex="~ row gap-2" overflow-hidden>
      <TransitionGroup name="list">
        <template v-for="(historyItem, index) in historyList" :key="historyItem.kid">
          <HistoryVideoCard
            :index="index"
            :history-item="historyItem"
            type="feed-you"
            shrink-0 basis="100% md:[calc(50%-5px)] lg:[calc(33.33%-5px)] xl:[calc(25%-5px)] 2xl:[calc(20%-5px)]"
            @delete-item="deleteHistoryItem"
          />
        </template>
      </TransitionGroup>
    </div>

    <!-- 收藏 -->
    <div flex justify-between items-center m="t-6 b-3">
      <h3 text="3xl $bew-text-1" font-bold>
        {{ $t('favorites.title') }}
      </h3>
      <Button
        size="large"
        style="
              --b-button-shadow: var(--bew-shadow-1);
            "
        @click="handleClick(AppPage.Favorites)"
      >
        {{ $t('common.view_all') }}
      </Button>
    </div>
    <!-- favorite list -->
    <div flex="~ row gap-2" overflow-hidden>
      <TransitionGroup name="list">
        <template v-for="item in favoriteResources" :key="item.id">
          <FavoritesVideoCard
            :item="item"
            m="8px"
            shrink-0 basis="100% md:[calc(50%-22px)] lg:[calc(33.33%-22px)] xl:[calc(25%-22px)] 2xl:[calc(20%-22px)]"
            @unfavorite="handleUnfavorite"
          />
        </template>
      </TransitionGroup>
    </div>

    <!-- dialog -->
    <Dialog
      v-if="showViewDialog"
      width="90%"
      content-height="80vh"
      :show-footer="false"
      append-to-bewly-body
      :title="pagesTitle[activatedPage]?.value" center
      @close="closeDialog"
    >
      <Component :is="pages[activatedPage]" parent="dialog" />
    </Dialog>
  </div>
</template>
