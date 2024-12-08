<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import type { FavoriteCategory } from '~/components/TopBar/types'
import { useBewlyApp } from '~/composables/useAppProvider'
import { AppPage } from '~/enums/appEnums'
import { getCSRF, openLinkToNewTab } from '~/utils/main'

import FavoritesVideoCard from '../Favorites/components/FavoritesVideoCard.vue'
import { favoritesProvider } from '../Favorites/FavoritesProvider'
import HistoryVideoCard from '../History/components/HistoryVideoCard.vue'
import { historyProvider } from '../History/HistoryProvider'
import WatchLaterVideoCard from '../WatchLater/components/WatchLaterVideoCard.vue'
import { watchLaterProvider } from '../WatchLater/WatchLaterProvider'

const { t } = useI18n()
const { handlePageRefresh } = useBewlyApp()

// Watch Later
const {
  isLoading: watchLaterLoading, // 是否正在加载稍后观看内容
  noMoreContent: watchLaterNoMoreContent, // 是否没有更多稍后观看内容
  allWatchLaterList: watchLaterAllList, // 所有稍后观看的完整视频列表
  currentWatchLaterList: watchLaterCurrentList, // 当前显示的稍后观看视频列表
  watchLaterCount: watchLaterTotalCount, // 稍后观看视频的总数量
  pageNum: watchLaterPageNum, // 当前稍后观看分页页码
  getAllWatchLaterList: fetchWatchLaterAllList, // 获取所有稍后观看内容的函数
  getCurrentWatchLaterList: fetchWatchLaterCurrentList, // 获取当前分页的稍后观看内容的函数
  deleteWatchLaterItem: deleteWatchLaterItemById, // 删除指定稍后观看视频的函数
} = watchLaterProvider()

// History
const {
  isLoading: historyLoading, // 是否正在加载历史记录内容
  noMoreContent: historyNoMoreContent, // 是否没有更多历史记录内容
  historyList: historyItems, // 历史记录视频列表
  currentPageNum: historyPageNum, // 当前历史记录分页页码
  getHistoryList: fetchHistoryItems, // 获取历史记录内容的函数
  deleteHistoryItem: deleteHistoryItemById, // 删除指定历史记录条目的函数
} = historyProvider()

// Favorites
const {
  favoriteCategories: favoritesCategories, // 收藏夹的分类列表
  favoriteResources: favoritesResources, // 当前分类下的收藏资源列表
  categoryOptions: favoritesCategoryOptions, // 收藏夹分类选项
  selectedCategory: favoritesSelectedCategory, // 当前选中的收藏分类
  currentPageNum: favoritesPageNum, // 当前收藏夹分页页码
  isLoading: favoritesLoading, // 是否正在加载收藏夹内容
  noMoreContent: favoritesNoMoreContent, // 是否没有更多收藏夹内容
  getFavoriteCategories: fetchFavoritesCategories, // 获取收藏夹分类的函数
  changeCategory: changeFavoritesCategory, // 切换收藏分类的函数
  handleUnfavorite: unfavoriteResource, // 移除收藏资源的函数
  handleSearch: searchFavorites, // 搜索收藏资源的函数
} = favoritesProvider()

// ==================== 页面切换逻辑 ====================
const activatedPage = ref<AppPage>(AppPage.History)
// const pages: Partial<Record<AppPage, ReturnType<typeof defineAsyncComponent>>> = {
//   [AppPage.WatchLater]: defineAsyncComponent(() => import('../WatchLater/WatchLater.vue')),
//   [AppPage.History]: defineAsyncComponent(() => import('../History/History.vue')),
//   [AppPage.Favorites]: defineAsyncComponent(() => import('../Favorites/Favorites.vue')),
// }
// const pagesTitle: Partial<Record<AppPage, ComputedRef<string>>> = {
//   [AppPage.WatchLater]: computed(() => `${t('watch_later.title')} (${watchLaterTotalCount.value ?? 0})`),
//   [AppPage.History]: computed(() => t('history.title')),
//   [AppPage.Favorites]: computed(() => t('favorites.title')),
// }

const showViewDialog = ref<boolean>(false)

// 切换页面时更新激活页面状态
function handleClick(page: AppPage) {
  activatedPage.value = page
  showViewDialog.value = true

  switch (page) {
    case AppPage.WatchLater:
      openLinkToNewTab('https://www.bilibili.com/?page=WatchLater')
      break
    case AppPage.History:
      openLinkToNewTab('https://www.bilibili.com/?page=History')
      break
    case AppPage.Favorites:
      openLinkToNewTab('https://www.bilibili.com/?page=Favorites')
      break
  }
}

// 关闭弹窗
// function closeDialog() {
//   showViewDialog.value = false
// }

// ==================== 页面生命周期事件 ====================
onMounted(async () => {
  initPageAction()
  await loadInitialData()
})

// 初始化页面刷新行为
function initPageAction() {
  handlePageRefresh.value = refreshAllData
}

// ==================== 数据加载逻辑 ====================

// 初始加载
async function loadInitialData() {
  // 加载收藏夹分类并切换到第一个分类
  await fetchFavoritesCategories()
  await changeFavoritesCategory(favoritesCategories[0])

  refreshAllData()
}

// 刷新所有数据
function refreshAllData() {
  resetAllData()
  fetchAllData()
}

// 清除所有数据
async function resetAllData() {
  resetWatchLaterData()
  resetHistoryData()
  resetFavoritesData()
}

// 获取所有数据
async function fetchAllData() {
  // 获取稍后再看数据
  await fetchWatchLaterAllList()
  fetchWatchLaterCurrentList()

  // 获取历史记录数据
  fetchHistoryItems()

  // 获取收藏夹数据
  searchFavorites()
}

// ==================== 辅助函数 ====================

// 重置稍后观看数据
function resetWatchLaterData() {
  watchLaterLoading.value = false
  watchLaterNoMoreContent.value = false
  watchLaterAllList.value.length = 0
  watchLaterCurrentList.value.length = 0
  watchLaterPageNum.value = 1
}

// 重置历史记录数据
function resetHistoryData() {
  historyItems.length = 0
  historyPageNum.value = 1
  historyNoMoreContent.value = false
}

// 重置收藏夹数据
function resetFavoritesData() {
  favoritesResources.length = 0
  favoritesPageNum.value = 1
  favoritesNoMoreContent.value = false
}
</script>

<template>
  <div v-if="getCSRF()" m="b-6">
    <!-- 稍后再看 -->
    <main m="t-6">
      <div flex justify-between items-center m="b-3">
        <h3 text="3xl $bew-text-1" font-bold>
          {{ t('watch_later.title') }} ({{ watchLaterTotalCount }})
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
      <Empty v-if="watchLaterTotalCount === 0 && !watchLaterLoading" />
      <template v-else>
        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="watchLaterLoading && !watchLaterNoMoreContent"
            m="-t-4"
          />
        </Transition>
        <!-- watcher later list -->
        <HorizontalScrollView>
          <div flex="~ row gap-2">
            <TransitionGroup name="list">
              <template v-for="(item, index) in watchLaterCurrentList" :key="item.aid">
                <WatchLaterVideoCard
                  :index="index"
                  :item="item"
                  type="feed-you"
                  shrink-0 basis="100% md:[calc(50%-5px)] lg:[calc(33.33%-5px)] xl:[calc(25%-5px)] 2xl:[calc(20%-5px)]"
                  @delete-item="deleteWatchLaterItemById"
                />
              </template>
            </TransitionGroup>
          </div>
        </HorizontalScrollView>
      </template>
    </main>

    <!-- 观看历史 -->
    <main m="t-18">
      <div flex justify-between items-center m="b-3">
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
      <Empty v-if="historyItems.length === 0 && !historyLoading" />
      <template v-else>
        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="historyLoading && !historyNoMoreContent"
            m="-t-4"
          />
        </Transition>
        <!-- history list -->
        <HorizontalScrollView>
          <div flex="~ row gap-2">
            <TransitionGroup name="list">
              <template v-for="(historyItem, index) in historyItems" :key="historyItem.kid">
                <HistoryVideoCard
                  :index="index"
                  :history-item="historyItem"
                  type="feed-you"
                  shrink-0 basis="100% md:[calc(50%-5px)] lg:[calc(33.33%-5px)] xl:[calc(25%-5px)] 2xl:[calc(20%-5px)]"
                  @delete-item="deleteHistoryItemById"
                />
              </template>
            </TransitionGroup>
          </div>
        </HorizontalScrollView>
      </template>
    </main>

    <!-- 收藏 -->
    <main m="y-18">
      <div flex="~ justify-between items-center" m="b-3">
        <div flex="~ row items-center gap-3">
          <h3 text="3xl $bew-text-1" font-bold>
            {{ $t('favorites.title') }}
          </h3>
          <Select v-model="favoritesSelectedCategory" w-150px :options="favoritesCategoryOptions" @change="(val: FavoriteCategory) => changeFavoritesCategory(val)" />
        </div>
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
      <Empty v-if="favoritesResources.length === 0 && !favoritesLoading" />
      <template v-else>
        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="favoritesLoading && !favoritesNoMoreContent"
            m="-t-4"
          />
        </Transition>
        <!-- favorite list -->
        <HorizontalScrollView>
          <div flex="~ row gap-2">
            <TransitionGroup name="list">
              <template v-for="item in favoritesResources" :key="item.id">
                <FavoritesVideoCard
                  :item="item"
                  m="8px"
                  shrink-0 basis="100% md:[calc(50%-22px)] lg:[calc(33.33%-22px)] xl:[calc(25%-22px)] 2xl:[calc(20%-22px)]"
                  @unfavorite="unfavoriteResource"
                />
              </template>
            </TransitionGroup>
          </div>
        </HorizontalScrollView>
      </template>
    </main>

    <!--    &lt;!&ndash; dialog &ndash;&gt;
    <Dialog
      v-if="showViewDialog"
      width="90%"
      content-height="80vh"
      :show-footer="false"
      append-to-bewly-body
      :title="pagesTitle[activatedPage]?.value" center
      @close="closeDialog"
    >
      <Component
        :is="pages[activatedPage]"
        parent="dialog"
        :category-item-index="favoritesCategories.findIndex(category => category === favoritesSelectedCategory)"
      />
    </Dialog> -->
  </div>
</template>
