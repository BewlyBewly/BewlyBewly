import type { AppPage } from '~/enums/appEnums'

export interface CurrentDockItem {
  label: string
  icon: string
  iconActivated: string
  page: AppPage
}

export interface HoveringDockItem {
  themeMode: boolean
  settings: boolean
}
