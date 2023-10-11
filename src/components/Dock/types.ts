import type { AppPage } from '~/enums/appEnums'

export interface DockItem {
  label: string
  icon: string
  iconActivated: string
  page: AppPage
}

export interface HoveringDockItem {
  themeMode: boolean
  settings: boolean
}
