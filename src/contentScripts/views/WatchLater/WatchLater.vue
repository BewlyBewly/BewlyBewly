<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useBewlyApp } from '~/composables/useAppProvider'
import api from '~/utils/api'
import { getCSRF, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'

import WatchLaterVideoCard from './components/WatchLaterVideoCard.vue'
import { watchLaterProvider } from './WatchLaterProvider'

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
  allWatchLaterList,
  currentWatchLaterList,
  watchLaterCount,
  pageNum,
  getAllWatchLaterList,
  getCurrentWatchLaterList,
  deleteWatchLaterItem,
} = watchLaterProvider()

onMounted(() => {
  initPageAction()
  initData()
})

async function initData() {
  isLoading.value = false
  noMoreContent.value = false
  allWatchLaterList.value.length = 0
  currentWatchLaterList.value.length = 0
  pageNum.value = 1
  await getAllWatchLaterList()
  getData()
}

function getData() {
  getCurrentWatchLaterList()
}

function initPageAction() {
  handlePageRefresh.value = async () => {
    if (isLoading.value)
      return

    initData()
  }

  handleReachBottom.value = async () => {
    getData()
  }
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
        initData()
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
          initData()
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
      <h3 v-if="parent !== 'dialog'" text="3xl $bew-text-1" font-bold mb-6>
        {{ t('watch_later.title') }} ({{ watchLaterCount }})
      </h3>
      <Empty v-if="watchLaterCount === 0 && !isLoading" />
      <template v-else>
        <!-- watcher later list -->
        <TransitionGroup name="list">
          <template v-for="(item, index) in currentWatchLaterList" :key="item.aid">
            <WatchLaterVideoCard
              :index="index"
              :item="item"
              @delete-item="deleteWatchLaterItem"
            />
          </template>
        </TransitionGroup>
        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="isLoading && currentWatchLaterList.length !== 0 && !noMoreContent"
            m="-t-4"
          />
        </Transition>
      </template>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div
        :class="{ 'top-120px my-10': parent === 'tab-page' }"
        pos="sticky top-0"
        w-full h="auto md:[calc(100vh-160px)]"
        m="t-1 b-10"
        rounded="$bew-radius"
        overflow-hidden
      >
        <!-- Frosted Glass Cover -->
        <div
          pos="absolute top-0 left-0" w-full h-full
          z--1
        >
          <div
            absolute w-full h-full
            bg="$bew-fill-4"
          />
          <img
            v-if="currentWatchLaterList[0]"
            :src="removeHttpFromUrl(`${currentWatchLaterList[0].pic}@480w_270h_1c`)"
            w-full h-full object="cover center" blur-40px
            relative z--1
          >
        </div>

        <!-- Content -->
        <main
          pos="absolute top-0 left-0"
          w-full h-full
          overflow-overlay
          flex="~ col gap-4 justify-start"
          p-6
        >
          <picture
            rounded="$bew-radius" style="box-shadow: 0 16px 24px -12px rgba(0, 0, 0, .36)"
            aspect-video mb-4 bg="$bew-skeleton"
          >
            <img
              v-if="currentWatchLaterList[0]" :src="removeHttpFromUrl(`${currentWatchLaterList[0].pic}@480w_270h_1c`)"
              rounded="$bew-radius" aspect-video w-full
            >
          </picture>

          <h3 text="3xl white" fw-600 style="text-shadow: 0 0 12px rgba(0,0,0,.3)">
            {{ t('watch_later.title') }} ({{ watchLaterCount }})
          </h3>
          <p v-if="watchLaterCount > 0" flex="~ col" gap-4>
            <Button
              color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
              @click="handlePlayAll"
            >
              <template #left>
                <div i-tabler:player-play />
              </template>
              {{ t('common.play_all') }}
            </Button>
            <Button
              color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
              @click="handleClearAllWatchLater"
            >
              <template #left>
                <div i-tabler:trash />
              </template>
              {{ t('watch_later.clear_all') }}
            </Button>
            <Button
              color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
              @click="handleRemoveWatchedVideos"
            >
              <template #left>
                <div i-tabler:circle-minus />
              </template>
              {{ t('watch_later.remove_watched_videos') }}
            </Button>
          </p>
        </main>
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
