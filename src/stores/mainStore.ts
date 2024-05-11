import { defineStore } from 'pinia'

import { HomeSubPage } from '~/contentScripts/views/Home/types'
import { AppPage } from '~/enums/appEnums'

export interface DockItem {
  i18nKey: string
  icon: string
  iconActivated: string
  page: AppPage
}

export interface HomeTab {
  i18nKey: string
  page: HomeSubPage
}

export const useMainStore = defineStore('main', () => {
  const dockItems = computed((): DockItem[] => {
    return [
      { i18nKey: 'dock.home', icon: 'i-mingcute:home-5-line', iconActivated: 'i-mingcute:home-5-fill', page: AppPage.Home },
      { i18nKey: 'dock.search', icon: 'i-mingcute:search-2-line', iconActivated: 'i-mingcute:search-2-fill', page: AppPage.Search },
      { i18nKey: 'dock.anime', icon: 'i-mingcute:tv-2-line', iconActivated: 'i-mingcute:tv-2-fill', page: AppPage.Anime },
      { i18nKey: 'dock.favorites', icon: 'i-mingcute:star-line', iconActivated: 'i-mingcute:star-fill', page: AppPage.Favorites },
      { i18nKey: 'dock.history', icon: 'i-mingcute:time-line', iconActivated: 'i-mingcute:time-fill', page: AppPage.History },
      { i18nKey: 'dock.watch_later', icon: 'i-mingcute:carplay-line', iconActivated: 'i-mingcute:carplay-fill', page: AppPage.WatchLater },
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
    ],
  )

  return { dockItems, homeTabs }
})
