import { defineStore } from 'pinia'

import type { AppPage } from '~/enums/appEnums'
import { TopBarPopup } from '~/enums/appEnums'
import { getUserID } from '~/utils/main'

export interface TopBarItem {
  i18nKey: string
  icon: string
  url: string
  popup?: TopBarPopup
  showPopup?: boolean
  page?: AppPage
}

export interface PopupVisible {
  notifications: boolean
  moments: boolean
  favorites: boolean
  history: boolean
}

export const useTopBarStore = defineStore('topBar', () => {
  const popupVisible = reactive({
    notifications: false,
    moments: false,
    favorites: false,
    history: false,
  })

  const topBarItems = computed((): TopBarItem[] => {
    return [
      {
        i18nKey: 'topbar.notifications',
        icon: 'tabler:bell',
        url: 'https://message.bilibili.com',
        popup: TopBarPopup.NotificationsPop,
        showPopup: popupVisible.notifications,
      },
      {
        i18nKey: 'topbar.moments',
        icon: 'tabler:windmill',
        url: 'https://t.bilibili.com',
        popup: TopBarPopup.MomentsPop,
        showPopup: popupVisible.moments,
      },
      {
        i18nKey: 'topbar.favorites',
        icon: 'mingcute:star-line',
        url: `https://space.bilibili.com/${getUserID()}/favlist`,
        popup: TopBarPopup.FavoritesPop,
        showPopup: popupVisible.favorites,
      },
      {
        i18nKey: 'topbar.history',
        icon: 'mingcute:time-line',
        url: 'https://www.bilibili.com/account/history',
        popup: TopBarPopup.HistoryPop,
        showPopup: popupVisible.history,
      },
      {
        i18nKey: 'topbar.creative_center',
        icon: 'mingcute:bulb-line',
        url: 'https://member.bilibili.com/platform/home',
      },
    ]
  })

  function setPopupVisible(popup: TopBarPopup) {
    switch (popup) {
      case TopBarPopup.NotificationsPop:
        popupVisible.notifications = !popupVisible.notifications
        break
      case TopBarPopup.MomentsPop:
        popupVisible.moments = !popupVisible.moments
        break
      case TopBarPopup.FavoritesPop:
        popupVisible.favorites = !popupVisible.favorites
        break
      case TopBarPopup.HistoryPop:
        popupVisible.history = !popupVisible.history
        break
    }
  }

  return { topBarItems, setPopupVisible }
})
