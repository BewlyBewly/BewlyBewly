import { useBewlyApp } from '~/composables/useAppProvider'
import type { HistoryResult, List as HistoryItem } from '~/models/history/history'
import type { HistorySearchResult, List as HistorySearchItem } from '~/models/video/historySearch'
import api from '~/utils/api'
import { getCSRF } from '~/utils/main'

export function historyProvider() {
  const { haveScrollbar } = useBewlyApp() // 不要把这句放在函数外面，因为这个函数是在content script中执行的，不是在vue中执行的

  const isLoading = ref<boolean>()
  const noMoreContent = ref<boolean>(false)
  const historyList = reactive<Array<HistoryItem>>([])
  const currentPageNum = ref<number>(1)
  const keyword = ref<string>()
  const historyStatus = ref<boolean>()

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

  return {
    isLoading,
    noMoreContent,
    historyList,
    currentPageNum,
    keyword,
    historyStatus,
    getHistoryList,
    searchHistoryList,
    deleteHistoryItem,
    getHistoryPauseStatus,
    setHistoryPauseStatus,
    clearAllHistory,
  }
}
