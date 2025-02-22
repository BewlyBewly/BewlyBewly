import { defineStore } from 'pinia'

import { HomeSubPage } from '~/contentScripts/views/Home/types'
import { AppPage } from '~/enums/appEnums'
import { getUserID } from '~/utils/main'

export interface DockItem {
  i18nKey: string
  icon: string
  iconActivated: string
  page: AppPage
  openInNewTab: boolean
  useOriginalBiliPage: boolean
  url: string
  hasBewlyPage: boolean // Whether BewlyBewly has a page for this item
}

export interface HomeTab {
  i18nKey: string
  page: HomeSubPage
}

export const useMainStore = defineStore('main', () => {
  const dockItems = computed((): DockItem[] => {
    return [
      {
        i18nKey: 'dock.home',
        icon: 'i-mingcute:home-5-line',
        iconActivated: 'i-mingcute:home-5-fill',
        page: AppPage.Home,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://www.bilibili.com',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.search',
        icon: 'i-mingcute:search-2-line',
        iconActivated: 'i-mingcute:search-2-fill',
        page: AppPage.Search,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://search.bilibili.com/all',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.anime',
        icon: 'i-mingcute:tv-2-line',
        iconActivated: 'i-mingcute:tv-2-fill',
        page: AppPage.Anime,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: 'https://www.bilibili.com/anime',
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.favorites',
        icon: 'i-mingcute:star-line',
        iconActivated: 'i-mingcute:star-fill',
        page: AppPage.Favorites,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://space.bilibili.com/${getUserID()}/favlist`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.history',
        icon: 'i-mingcute:time-line',
        iconActivated: 'i-mingcute:time-fill',
        page: AppPage.History,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://www.bilibili.com/history`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.watch_later',
        icon: 'i-mingcute:carplay-line',
        iconActivated: 'i-mingcute:carplay-fill',
        page: AppPage.WatchLater,
        openInNewTab: false,
        useOriginalBiliPage: false,
        url: `https://www.bilibili.com/watchlater/list`,
        hasBewlyPage: true,
      },
      {
        i18nKey: 'dock.moments',
        icon: 'i-tabler:windmill',
        iconActivated: 'i-tabler:windmill-filled',
        page: AppPage.Moments,
        openInNewTab: false,
        useOriginalBiliPage: true,
        url: `https://t.bilibili.com`,
        hasBewlyPage: false,
      },
    ]
  })

  const homeTabs = shallowReadonly<HomeTab[]>(
    [
      {
        i18nKey: 'home.for_you',
        page: HomeSubPage.ForYou,
      },
      {
        i18nKey: 'home.following',
        page: HomeSubPage.Following,
      },
      {
        i18nKey: 'home.subscribed_series',
        page: HomeSubPage.SubscribedSeries,
      },
      {
        i18nKey: 'home.trending',
        page: HomeSubPage.Trending,
      },
      {
        i18nKey: 'home.ranking',
        page: HomeSubPage.Ranking,
      },
      {
        i18nKey: 'home.live',
        page: HomeSubPage.Live,
      },
    ],
  )

  const activatedCover = ref<string>('')

  function getBiliWebPageURLByPage(page: AppPage): string {
    const dockItem = dockItems.value.find(e => e.page === page)
    return dockItem?.url || ''
  }

  function getDockItemByPage(page: AppPage): DockItem | undefined {
    return dockItems.value.find(e => e.page === page)
  }

  function setActivatedCover(cover: string) {
    requestAnimationFrame(() => {
      activatedCover.value = cover
    })
  }

  function getActivatedCover(): string {
    return activatedCover.value
  }

  return { dockItems, homeTabs, getBiliWebPageURLByPage, getDockItemByPage, setActivatedCover, getActivatedCover }
})
