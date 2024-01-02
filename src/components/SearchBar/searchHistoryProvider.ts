const SEARCH_HISTORY_KEY = 'bew_search_history'
const BILIBILI_HISTORY_KEY = 'search_history:search_history'
const SEARCH_HISTORY_LIMIT = 10

export interface HistoryItem {
  value: string
  timestamp: number
}
export interface SuggestionItem {
  value: string
  timestamp: number
}
export interface StorageEvent {
  type: 'COLS_RES'
  id?: string
  key: string
  value: string
}

function historySort(historyItems: HistoryItem[]) {
  historyItems.sort((a, b) => b.timestamp - a.timestamp)
  return historyItems
}

export async function getSearchHistory(): Promise<HistoryItem[]> {
  let history: string | HistoryItem[] | null = localStorage.getItem(SEARCH_HISTORY_KEY)
  if (!history) {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]))
    history = []
  }
  else {
    history = JSON.parse(history)
  }

  const iframe = Array.from(document.getElementsByTagName('iframe')).find(i => i.src.includes('https://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html'))
  if (iframe && iframe.contentWindow) {
    function getStorage() {
      return new Promise<StorageEvent>((resolve) => {
        iframe!.contentWindow!.postMessage({ type: 'COLS_GET', key: BILIBILI_HISTORY_KEY }, iframe!.src)
        window.addEventListener('message', (e: MessageEvent<StorageEvent>) => {
          if (e.origin === 'https://s1.hdslb.com' && e.data && e.data?.type === 'COLS_RES' && e.data?.key === BILIBILI_HISTORY_KEY)
            resolve(e.data)
        }, { once: true })
      })
    }

    const e = await getStorage()
    if (e.value && Array.isArray(history)) {
      try {
        const h = JSON.parse(e.value)
        history.push(...Array.isArray(h) ? h : [])
      }
      catch {
        // ignore
      }
    }
  }

  return historySort(history as HistoryItem[])
}

export async function addSearchHistory(historyItem: HistoryItem) {
  let history = await getSearchHistory()

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

export async function removeSearchHistory(value: string) {
  let history = await getSearchHistory()
  history = history.filter(item => item.value !== value)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history))
}

export function clearSearchHistory() {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]))
  const iframe = Array.from(document.getElementsByTagName('iframe')).find(i => i.src.includes('https://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html'))
  if (iframe && iframe.contentWindow)
    iframe.contentWindow.postMessage({ type: 'COLS_CLR', key: 'search_history' }, iframe.src)
}
