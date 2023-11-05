const SEARCH_HISTORY_KEY = 'bew_search_history'
const SEARCH_HISTORY_LIMIT = 10

export interface HistoryItem {
  value: string
  timestamp: number
}
export interface SuggestionItem {
  value: string
  timestamp: number
}

function historySort(historyItems: HistoryItem[]) {
  historyItems.sort((a, b) => b.timestamp - a.timestamp)
  return historyItems
}

export function getSearchHistory(): HistoryItem[] {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY)
  if (!history) {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]))
    return []
  }
  return historySort(JSON.parse(history))
}

export function addSearchHistory(historyItem: HistoryItem) {
  let history = getSearchHistory()

  let hasSameValue = false
  history.forEach((item) => {
    if (item.value === historyItem.value) {
      item.timestamp = historyItem.timestamp
      hasSameValue = true
    }
  })
  if (!hasSameValue)
    history.unshift(historyItem)

  // if out of limit, remove overflow items
  history = history.filter((item, index) => {
    if (index < SEARCH_HISTORY_LIMIT)
      return item
    else return false
  })

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}

export function removeSearchHistory(value: string) {
  let history = getSearchHistory()
  history = history.filter(item => item.value !== value)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}
