import { defineStore } from 'pinia'
import { AppPage } from '~/enums/appEnums'

export interface DockItem {
  i18nKey: string
  icon: string
  iconActivated: string
  page: AppPage
}

export const useMainStore = defineStore('main', () => {
  const dockItems = computed((): DockItem[] => {
    return [
      { i18nKey: 'dock.home', icon: 'mingcute:home-5-line', iconActivated: 'mingcute:home-5-fill', page: AppPage.Home },
      { i18nKey: 'dock.search', icon: 'mingcute:search-2-line', iconActivated: 'mingcute:search-2-fill', page: AppPage.Search },
      { i18nKey: 'dock.anime', icon: 'mingcute:tv-2-line', iconActivated: 'mingcute:tv-2-fill', page: AppPage.Anime },
      { i18nKey: 'dock.favorites', icon: 'mingcute:star-line', iconActivated: 'mingcute:star-fill', page: AppPage.Favorites },
      { i18nKey: 'dock.history', icon: 'mingcute:time-line', iconActivated: 'mingcute:time-fill', page: AppPage.History },
      { i18nKey: 'dock.watch_later', icon: 'mingcute:carplay-line', iconActivated: 'mingcute:carplay-fill', page: AppPage.WatchLater },
    ]
  })

  return { dockItems }
})
