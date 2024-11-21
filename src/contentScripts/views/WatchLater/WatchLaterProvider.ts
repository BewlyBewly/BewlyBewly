import { ref } from 'vue'

import { useBewlyApp } from '~/composables/useAppProvider'
import type { List as VideoItem, WatchLaterResult } from '~/models/video/watchLater'
import api from '~/utils/api'
import { getCSRF } from '~/utils/main'

export function watchLaterProvider() {
  const { haveScrollbar } = useBewlyApp()

  const isLoading = ref<boolean>()
  const noMoreContent = ref<boolean>()
  const allWatchLaterList = ref<VideoItem[]>([])
  const currentWatchLaterList = ref<VideoItem[]>([])
  const watchLaterCount = ref<number>(0)
  const pageNum = ref<number>(1)

  /**
   * Get watch later list
   */
  async function getAllWatchLaterList() {
    isLoading.value = true
    currentWatchLaterList.value.length = 0
    try {
      const res: WatchLaterResult = await api.watchlater.getAllWatchLaterList()
      if (res.code === 0) {
        allWatchLaterList.value = res.data.list
        watchLaterCount.value = allWatchLaterList.value.length
      }
    }
    finally {
      isLoading.value = false
    }
  }

  function getCurrentWatchLaterList() {
    const allWatchLaterListCopy = JSON.parse(JSON.stringify(allWatchLaterList.value))
    const currentList = allWatchLaterListCopy.slice((pageNum.value - 1) * 10, pageNum.value * 10)

    if (currentList.length === 0) {
      noMoreContent.value = true
      return
    }
    pageNum.value++
    currentWatchLaterList.value.push(...currentList)

    if (!haveScrollbar() && !noMoreContent.value) {
      getCurrentWatchLaterList()
    }
  }

  function deleteWatchLaterItem(index: number, aid: number) {
    api.watchlater.removeFromWatchLater({
      aid,
      csrf: getCSRF(),
    })
      .then((res) => {
        if (res.code === 0) {
          currentWatchLaterList.value.splice(index, 1)
          watchLaterCount.value--
        }
      })
  }

  return {
    isLoading,
    noMoreContent,
    allWatchLaterList,
    currentWatchLaterList,
    watchLaterCount,
    pageNum,
    getAllWatchLaterList,
    getCurrentWatchLaterList,
    deleteWatchLaterItem,
  }
}
